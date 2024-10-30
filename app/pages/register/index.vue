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
                                    <p>{{ user.provider }} Logo</p>
                                </div>
                            </div>
                        </div>
                        <div class="field-container">
                            <div v-if="user.provider !== 'credentials'" class="oauth-registration">
                                <label for="username">{{ username }}</label>
                                <input
                                    v-model="username"
                                    type="text"
                                    id="username"
                                    @input="(e: Event) => oauthForm.updateField(
                                        'username',
                                        (e.target as HTMLInputElement).value)"
                                />
                                <span v-if="oauthForm.errors.value.username">{{ oauthForm.errors.value.username }}</span>
                            </div>
                            <button type="submit" :disabled="!oauthForm.isValid">
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
import { useFormValidation } from '~/composables/form/useFormValidation';
import { isRegisteredUser, type UnregisteredUser, type LinkableData } from '~~/types/user';

const router = useRouter()
const route = useRoute()
const { session } = useAuthState()

const linkableUsersData = await session.value.linkable_data as LinkableData;
const hasLinkableUsers = (linkableUsersData && linkableUsersData.existing_users_count >= 1) 
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

const { user, clearSession, getNewSession } = useAuthState()


const userEmail = computed(() => {
    if (user && user.value && !isRegisteredUser(user.value)) {
        return user.value.provider_email
    }
    else {
        return ''
    }
})

// OAuth Form Validator -----------------------------------------
interface OAuthRegistrationForm {
    username: string
}

const username = ref('')

const oauthForm = useFormValidation<OAuthRegistrationForm>({
    username: username.value,
})

oauthForm.bindField('username', username)

oauthForm.setFieldRules(
    'username',
    oauthForm.rules.required('Username is required'),
    oauthForm.rules.minLengthString(1, 'Username must be at least 3 characters'),
    oauthForm.rules.maxLengthString(20, 'Username must be no more than 20 characters'),
    oauthForm.rules.pattern(
        /^[a-zA-Z0-9_-]+$/, 
        'Username can only contain letters, numbers, underscores, and hyphens'
    )
)

// Form submission ----------------------------------------------
const registerOAuth = async () => {
    if (!oauthForm.validateForm()) {
        console.log('Form is invalid')
        return
    }

    try {
        const response = await fetch('/api/auth/register/oauth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(oauthForm.values.value),
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
// ----------------------------------------------------------------
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