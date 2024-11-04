<template>
    <div class="page wrapper-container">
        <h1>Register</h1>
        <section class="registration-container">
            <p>aowdiunaw</p>
            <Authenticator>
                <template #unregistered>
                    <div v-if="showLinkAccounts">
                        <div v-if="hasLinkableUsers">
                            <h2>Link to existing account</h2>
                            <p>We found other accounts using the email: {{ linkableUsersData.provider_email  }} </p>
                            <p>Do you want to link an email and password login to an existing account?</p>
                            <button @click="showLinkAccounts = false;">No</button>
                            <NuxtLink to="/register/link">Yes</NuxtLink>
                        </div>
                    </div>
                    <div v-else>
                        <button v-if="hasLinkableUsers" @click="showLinkAccounts = true;">Back</button>
                        <section v-if="isVerified">
                            <h2>Pick a username:</h2>
                            <form @submit.prevent="submitUsername()">
                                <input type="text" id="username" name="username" required v-model="unregisteredUser.username" />
                                <button type="submit">Submit</button>
                            </form>
                        </section>
                        <section v-else>
                            <div class="verify">
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
                </template>
            </Authenticator>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { type UnregisteredLinkableData } from '~~/types/auth/user/session/unregistered';
import { type UnregisteredUser } from '~~/types/auth/user/session/unregistered';

const { session, user, getNewSession } = useAuthState()

const unregisteredUser = ref(user.value as UnregisteredUser)

const linkableUsersData = ref(session.value.linkable_data as UnregisteredLinkableData);
const hasLinkableUsers = ref(linkableUsersData.value !== null && linkableUsersData.value?.existing_users_count > 0)
const showLinkAccounts = ref(hasLinkableUsers.value)

// Email verification --------------------------------------------------------
const codeSent = ref(false)
const isVerified = ref(unregisteredUser.value?.provider_verified)

console.log(isVerified.value)
console.log(unregisteredUser.value)

const errorSendingVerification = ref(false)
const errorMessage = ref('')
const sendVerificationOTP = async () => {
    codeSent.value = false
    errorSendingVerification.value = false
    errorMessage.value = ''
    
    try {
        const response = await fetch('/api/auth/verification/linking/generate', {
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
        const response = await fetch('/api/auth/verification/linking/verify', {
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
    const response: any = await $fetch('/api/auth/register/oauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: unregisteredUser.value.username
        }),
    });

    if (response.statusCode === 201) {
        await getNewSession()
        navigateTo('/')
    }
    else {
        alert('Invalid username')
    }
}
</script>