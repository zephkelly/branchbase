<template>
    <div class="page wrapper-container">
        <Authenticator>
            <template #unregistered="{ user, session }">
                <h1>Register</h1>
                <a href="/register?nolink=true">Actually i dont want to link</a>
                <div class="linkable-users" v-if="isVerified">
                    <h2>Linkable Users</h2>
                    <!-- <p>{{ session.value?.linkable_data }}</p> -->
                    <div style="display: flex; flex-direction: row;">
                        <div 
                            class="user"
                            :key="index"
                            v-for="(account, index) in (session.value?.linkable_data as VerifiedLinkableData).linkable_providers">
                                <p>{{ account.username }}</p>
                                <p>{{ account.providers[0]?.provider }}</p>
                                <button @click.prevent="linkProvider(index)">Link {{ index }}</button>
                        </div>
                    </div>
                </div>
                <div class="linkable-users" v-else>
                    <h2>Verify email</h2>
                    <p>{{ session.value?.linkable_data }}</p>
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
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
import { type LinkableData, type VerifiedLinkableData } from '~~/types/user';

const { session, getNewSession } = useAuthState()

const linkableUsersData = ref(session.value.linkable_data as LinkableData);
const verifiedLinkableData = ref(session.value.linkable_data as VerifiedLinkableData)

const isVerified = ref(verifiedLinkableData.value.linkable_providers !== undefined)
console.log(isVerified.value)

const router = useRouter()

const sentVerification = ref(false)
const errorSendingVerification = ref(false)
const errorMessage = ref('')

const otpCode = ref('')

const sendVerificationOTP = async () => {
    sentVerification.value = false
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
            sentVerification.value = true
        }

    }
    catch (error) {
        console.error('Error during registration:', error)
    }
}

const verifiedOTPId = ref('')
const verifyOTP = async () => {
    try {
        const response = await fetch('/api/auth/verification/linking/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp: otpCode.value
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

const linkProvider = async (userIndex: number) => {
    try {
        const user = (session.value?.linkable_data as VerifiedLinkableData).linkable_providers[userIndex]

        if (!user) {
            throw new Error('User not found')
        }

        console.log('Selected user:', user)

        const response = await fetch('/api/auth/register/link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp_id: verifiedOTPId.value,
                existing_user_index: userIndex
            })
        })

        if (!response.ok) {
            throw new Error('Linking failed')
        }

        await getNewSession()

        router.push('/')
    }
    catch (error) {
        console.error('Error during registration:', error)
    }
}

onBeforeMount(() => {
    if (!session.value.user || !linkableUsersData) {
        navigateTo('/register');
    }
})
</script>