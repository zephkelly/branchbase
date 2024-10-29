<template>
    <div class="page wrapper-container">
        <Authenticator>
            <template #unregistered="{ user, session }">
                <h1>Register</h1>
                <a href="/register?nolink=true">Actually i dont want to link</a>
                <div class="linkable-users" v-if="isVerified === false">
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
                <div class="linkable-users" v-else>
                    <h2>Linkable Users</h2>
                    <p>{{ session.value?.linkable_data }}</p>
                    <form @submit.prevent="">
                        <button type="submit">Select account</button>
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

const isVerified = computed(() => {
    return verifiedLinkableData.value.linkable_providers !== undefined
})

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
        const response = await fetch('/api/auth/verification/email/generate', {
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

const verifyOTP = async () => {
    try {
        const response = await fetch('/api/auth/verification/email/verify', {
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

        await getNewSession()
    }
    catch (error) {
        console.error('Error during registration:', error)
    }
}

// const linkProvider = async () => {
//     try {
//         const response = await fetch('/api/auth/register/link', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })

//         if (!response.ok) {
//             throw new Error('Linking failed')
//         }

//         await getNewSession()

//         router.push('/')
//     }
//     catch (error) {
//         console.error('Error during registration:', error)
//     }
// }

onBeforeMount(() => {
    if (!session.value.user || !linkableUsersData) {
        navigateTo('/register');
    }
})
</script>