<template>
    <div class="page wrapper-container">
        <h1>Register</h1>
        <Authenticator>
            <template #default="{ user }">
                <h1>Register</h1>
            </template>
            <template #unregistered="{ user }">
                <div v-if="showAccountLinkingOption">
                    <h2>Can link account</h2>
                    <p>We found another account using the email: {{ linkableUsersData.provider_email  }} </p>
                    <p>Do you want to link this provider an existing account?</p>
                    <a href="/register/link">Yes</a>
                    <button @click="showAccountLinkingOption = false">No</button>
                </div>
                <div v-else>
                    <div v-if="hasLinkableUsers">
                        <button @click="showAccountLinkingOption = true">I changed my mind, I want to link my account</button>
                    </div>
                    <h2>Complete your registration</h2>
                    <form @submit.prevent="registerOAuth">
                        <p>You are signing up through {{ user.provider }} with email: {{ user.provider_email }}</p>
                        <div class="field-container email">
                            <div v-if="user.provider === 'credentials'" class="new-registration">
                                <div class="field">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" name="email" required v-model="userEmail">
                                </div>
                            </div>
                            <div v-else class="oauth-registration">
                                <div class="field">
                                    <p>{{ user.provider === 'google' ? 'Google' : 'GitHub' }} Logo</p>
                                </div>
                            </div>
                        </div>
                        <div class="field-container">
                            <div v-if="user.provider !== 'credentials'" class="oauth-registration">
                                <div v-for="(field, name) in formState" :key="name">
                                    <label :for="name">{{ name }}</label>
                                    <input
                                        :id="name"
                                        :value="field.value"
                                        @input="(e: Event) => handleInput(name, e)"
                                        @blur="field.isDirty = true"
                                        :class="{ 'error': errors[name] && field.isDirty }"
                                    />
                                    <span v-if="errors[name]" class="error">
                                        {{ errors[name] }}
                                    </span>
                                </div>
                            </div>
                            <button type="submit" :disabled="!isValid">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
import { isRegisteredUser, type UnregisteredUser, type LinkableData } from '~~/types/user';

const router = useRouter()
const route = useRoute()
const { session } = useAuthState()

const linkableUsersData = await session.value.linkable_data as LinkableData;
const hasLinkableUsers = (linkableUsersData && linkableUsersData.existing_providers_number === 1) 
    ? true 
    : false;

const showAccountLinkingOption = ref<boolean>(false);

const doesNotWantToLink = route.query.nolink === 'true';

if (hasLinkableUsers && !doesNotWantToLink) {
    showAccountLinkingOption.value = true;
}

if (doesNotWantToLink) {
    router.replace({ query: {} });
}


const { user, clear: clearSession, fetch: getNewSession } = useUserSession()

const userEmail = computed(() => {
    if (user && user.value && !isRegisteredUser(user.value)) {
        return (user.value as UnregisteredUser).provider_email
    }
    else {
        return ''
    }
})

// Form validation and sanitisation
interface RegistrationForm {
    username: string
}

const initialValues: RegistrationForm = {
    username: '',
}

const {
    formState,
    rules,
    setFieldRules,
    validateForm,
    updateField,
    values,
    isValid,
    errors
} = useFormValidation<RegistrationForm>(initialValues)

setFieldRules(
    'username',
    rules.required('Username is required'),
    rules.minLength(1, 'Username must be at least 1 character'),
    rules.maxLength(20, 'Username must be no more than 20 characters'),
    rules.pattern(
        /^[a-zA-Z0-9_-]+$/, 
        'Username can only contain letters, numbers, underscores, and hyphens'
    )
)

const handleInput = (fieldName: keyof RegistrationForm, event: Event) => {
    const input = event.target as HTMLInputElement
    updateField(fieldName, input.value)
}

const registerOAuth = async () => {
    if (!validateForm()) {
        console.log('Form is invalid')
        return
    }

    try {
        const response = await fetch('/api/auth/register/oauth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values.value),
        })

        if (!response.ok) {
            throw new Error('Registration failed')
        }

        await getNewSession()

        router.push('/')
    }
    catch (error) {
        console.error('Error during registration:', error)
    }
}

// if (user && user.value) {
//     if (alreadyRegistered.value) {
//         console.log("User is already registered, maybe they want to make a new account?");
//         wantsToReRegisterChoice.value = true;
//     }
//     else {
//         console.log("User is not finished registering, continue with registration");
//     }
// }
// else {
//     console.log("New user is trying to signup");
// }
</script>

<style scoped>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .re-register {
        margin-top: 2rem;
    }
</style>