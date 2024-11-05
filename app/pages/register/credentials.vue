<template>
    <div class="page wrapper-container">
        <h1>Register</h1>
        <Authenticator>
            <template #unregistered>
                <section class="registration-container">
                    <div v-if="isPasswordConfirmed" class="password-confirmed">
                        <section v-if="isVerified" class="registration-container verified">
                            <NuxtLink to="/register/link">Actually I want to link!</NuxtLink>
                            <h2>Pick a username:</h2>
                            <form @submit.prevent="submitUsername()">
                                <input type="text" id="username" name="username" required v-model="unregisteredUser.username" />
                                <button type="submit">Submit</button>
                            </form>
                        </section>
                        <section v-else class="registration-container">
                            <div v-if="!showLinkAccounts">
                                <button @click="showLinkAccounts = true;">Back</button>
                            </div>

                            <!-- Linkable -->
                            <div v-if="hasLinkableUsers && showLinkAccounts" class="linkable">
                                <div>
                                    <h2>Link to existing account</h2>
                                    <p>We found other accounts using the email: {{ linkableUsersData.provider_email  }} </p>
                                    <p>Do you want to link an email and password login to an existing account?</p>
                                    <button @click="showLinkAccounts = false;">No</button>
                                    <NuxtLink to="/register/link">Yes</NuxtLink>
                                </div>
                            </div>

                            <!-- Unlinkable -->
                            <div v-else class="unlinkable">
                                <h2>Email Verification</h2>
                                <p>We need to verify your email with a short, OTP (one-time passcode).</p>
                                <form @submit.prevent="">
                                    <input type="email" id="email" name="email" required v-model="unregisteredUser.provider_email" disabled />
                                    <button @click="sendVerificationOTP()">Send Code</button>
                                    <div v-if="codeSent" >
                                        <label for="code">Code</label>
                                        <input type="text" id="code" name="code" required v-model="codeInput" />
                                        <button @click="verifyOTP()">Verify</button>
                                    </div>
                                </form>
                            </div>
                        </section>         
                    </div>
                    <div v-else>
                        <h2>Register with email</h2>
                        <form @submit.prevent="">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required v-model="unregisteredUser.provider_email" disabled />
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required v-model="passwordInput" />
                            <label for="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" name="confirm-password" required v-model="confirmPasswordInput" />
                            <button @click="submitUnregisteredLinkableCredentials()">Submit</button>
                        </form>
                    </div>
                </section>
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
// import { Provider, type LinkableData, type UnregisteredUser } from '~~/types/user';
import { Provider } from '~~/types/auth/user/providers';
import { type UnregisteredLinkableData } from '~~/types/auth/user/session/unregistered';
import { type UnregisteredCredUser } from '~~/types/auth/user/session/credentials/unregistered';

const router = useRouter()
const route = useRoute()

// Session data --------------------------------------------------------------
const { user, session, getNewSession, clearSession } = useAuthState()
// await getNewSession()
// console.log('Session:', session.value)

const unregisteredUser = ref(user.value as UnregisteredCredUser);
const linkableUsersData = ref(session.value.linkable_data as UnregisteredLinkableData);

const hasLinkableUsers = ref(linkableUsersData.value !== null && linkableUsersData.value?.existing_users_count > 0)
const showLinkAccounts = ref(true)

const isPasswordConfirmed = computed(() => { return session.value?.confirmed_password })

// Check if the user is actually unregistered --------------------------------
if (!unregisteredUser.value) {
    navigateTo('/register')
}
else {
    // If they are already registered, redirect to the home page --------------
    if (unregisteredUser.value.id !== null) {
        navigateTo('/')
    }
    // If they are not a credentials user redirect them to OAuth --------------
    else
    if (unregisteredUser.value.provider !== Provider.Credentials) {
        navigateTo('/register/oauth')
    }
}


// Submit credentials to initiate account linking -----------------------------
const passwordInput = ref('')
const confirmPasswordInput = ref('')

async function submitUnregisteredLinkableCredentials() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        alert('Passwords do not match')
        return
    }

    const response: any = await $fetch('/api/v1/auth/register/credentials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: unregisteredUser.value.provider_email,
            password: passwordInput.value,
            confirm_password: confirmPasswordInput.value
        }),
    });

    if (response.statusCode === 200) {
        await getNewSession()

        if (session.value.confirmed_password) {
            navigateTo('/register/link')
        }
    }
    else {
        console.log(response)
        alert('Invalid credentials')
    }
}


// Email verification --------------------------------------------------------
const codeSent = ref(false)
const isVerified = ref(unregisteredUser.value?.provider_verified)

const errorSendingVerification = ref(false)
const errorMessage = ref('')
const sendVerificationOTP = async () => {
    codeSent.value = false
    errorSendingVerification.value = false
    errorMessage.value = ''
    
    try {
        const response = await fetch('/api/v1/auth/verification/linking/generate', {
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
            codeSent.value = true
        }
        
    }
    catch (error) {
        console.error('Error during registration:', error)
    }
}

const codeInput = ref('')
const verifiedOTPId = ref('')
const verifyOTP = async () => {
    try {
        const response = await fetch('/api/v1/auth/verification/linking/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp: codeInput.value
            })
        })

        if (!response.ok) {
            console.log(response)
            throw new Error('Verification failed')
        }

        const data = await response.json()
        verifiedOTPId.value = data.otp_id

        isVerified.value = true

        await getNewSession()
    }
    catch (error) {
        console.error('Error during registration:', error)
    }
}


// Submit username -----------------------------------------------------------
const submitUsername = async () => {
    const response: any = await $fetch('/api/v1/auth/register/credentials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: unregisteredUser.value.username,
            otp_id: verifiedOTPId.value
        }),
    });

    if (response.statusCode === 201) {
        await getNewSession()
        navigateTo('/')
    }
    else {
        console.log(response)
    }
}
</script>

<style lang="scss" scoped>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>