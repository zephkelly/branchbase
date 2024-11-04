<template>
    <div class="page wrapper-container">
        <h1>Register</h1>
        <Authenticator>
            <template #default="{ user }">
                <h1>Register</h1>
            </template>
            <template #unregistered="{ user, clearSession }">
                <button @click="clearSession">Log out</button>
                <div v-if="showAccountLinkingOption && isVerified">
                    <h2>Can link account</h2>
                    <p>We found another account using the email: {{ linkableUsersData.provider_email  }} </p>
                    <p>Do you want to link this provider an existing account?</p>
                    <a href="/register/link">Yes</a>
                    <button @click="showAccountLinkingOption = false">No</button>
                </div>
                <div v-else>
                    <div v-if="hasLinkableUsers && isVerified">
                        <a href="/register/link">I changed my mind, I want to link my account</a>
                    </div>
                    <h2>Complete your registration</h2>
                    <div v-if="isVerified">
                        <form @submit.prevent="registerOAuth" v-if="user.provider !== 'credentials'">
                            <p>You are signing up through {{ user.provider }} with email: {{ user.provider_email }}</p>
                            <div class="field-container">
                                <div class="oauth-registration">
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
                        <form @submit.prevent="" v-else>
                            <p>You are signing up through {{ user.provider }} with email: {{ user.provider_email }}</p>
                            <div class="field-container email">
                                <div class="field">
                                    <p>Username</p>
                                    <label for="username">{{ username }}</label>
                                    <input
                                        v-model="username"
                                        type="text"
                                        id="username"
                                        @input="(e: Event) => oauthForm.updateField(
                                            'username',
                                            (e.target as HTMLInputElement).value)"
                                    />
                                </div>
                                <div class="field">
                                    <p>{{ user.provider }} Logo</p>
                                </div>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                    <div v-else>
                        <p>Provider email not verified</p>
                        <h2>Verify email</h2>
                        <form @submit.prevent="sendVerificationOTP">
                            <button type="submit">Verify Email</button>
                            <p v-if="sentVerification"></p>
                            <p v-if="errorSendingVerification" style="color: red;">Error sending verification. {{ errorMessage }}</p>
                        </form>
                        <form v-if="sentVerification" style="margin-top: 1rem;" @submit.prevent="verifyOTP">
                            <label for="otp">OTP</label>
                            <input type="text" id="otp" name="otp" required v-model="otpCode">
                            <button type="submit">Verify OTP</button>
                        </form>
                    </div>
                </div>
            </template>
            <template #public>
                <h2>Sign In</h2>
                <NuxtLink to="/register" class="button">Register with Email</NuxtLink>
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
import { useFormValidation } from '~/composables/form/useFormValidation';
// import { isRegisteredUser, type UnregisteredUser, type LinkableData } from '~~/types/user';

import { isRegisteredUser } from '~~/types/auth/user/session/registered';
import { type UnregisteredUser, type UnregisteredLinkableData } from '~~/types/auth/user/session/unregistered';

const router = useRouter()
const route = useRoute()

const { user, clearSession, getNewSession, session } = useAuthState()

const linkableUsersData = await session.value.linkable_data as UnregisteredLinkableData;
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

// Provider not verified ------------------------------------------
const sentVerification = ref(false)
const errorSendingVerification = ref(false)
const errorMessage = ref('')

const isVerified = ref((user.value as UnregisteredUser)?.provider_verified)

const sendVerificationOTP = async () => {
    sentVerification.value = false
    errorSendingVerification.value = false
    errorMessage.value = ''

    try {
        const response = await fetch('/api/auth/verification/register/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            errorSendingVerification.value = true
            errorMessage.value = response.statusText
            throw new Error('Verification sending failed')
        }
        else {
            sentVerification.value = true
        }

    }
    catch (error) {
        console.error('Error during registration:', error)
    }
}

const otpCode = ref('')
const verifiedOTPId = ref('')
const verifyOTP = async () => {
    try {
        const response = await fetch('/api/auth/verification/register/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp: otpCode.value
            })
        })

        if (!response.ok) {
            if (response.status === 409) {
                isVerified.value = true
                return
            }
        }

        console.log('Verification response', response)


        const data = await response.json()
        verifiedOTPId.value = data.otp_id

        isVerified.value = true

        console.log(session.value)

        await getNewSession()

        console.log(session.value)
    }
    catch (error) {
        console.error('Error during registration:', error)
    }
}
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