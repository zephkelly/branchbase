<template>
    <div class="page wrapper-container">
        <Authenticator>
            <template #unregistered="{ user, session }">
                <h1>Register</h1>
                <a href="/register?nolink=true">Actually i dont want to link</a>
                <div class="linkable-users" v-if="isVerified">
                    <h2>Linkable Users</h2>
                    <div class="users" style="display: flex; flex-direction: row;">
                        <div
                            class="user"
                            :key="index"
                            v-for="(account, index) in (session.value?.linkable_data as VerifiedUnregisteredLinkableData).linkable_users">
                                <p>{{ account.username }}</p>
                                <img :src="account.picture" alt="User Picture" />
                                <p>{{ account.providers[0]?.provider }}</p>
                                <button @click.prevent="linkProvider(index)">Link {{ index }}</button>
                                <p v-if="errorLinkingProvider" style="color: red;">{{ errorLinkingProviderMessage }}</p>
                        </div>
                    </div>
                </div>
                <div class="linkable-users" v-else>
                    <h2>Verify email</h2>
                    <p>{{ session.value?.linkable_data }}</p>
                    <form @submit.prevent="sendVerificationOTP">
                        <button type="submit">Verify Email</button>
                        <p v-if="errorSendingVerification" style="color: red;">{{ errorSendingVerificationMessage }}</p>
                    </form>
                    <form v-if="sentVerification" style="margin-top: 1rem;" @submit.prevent="verifyOTP">
                        <label for="otp">OTP</label>
                        <input type="text" id="otp" name="otp" required v-model="otpCode">
                        <button type="submit">Verify OTP</button>
                        <p v-if="errorVerifyingOtp" style="color: red;">{{ errorVerifyingOtpMessage }}</p>
                    </form>
                </div>
            </template>
            <template #loading>
                <p>Loading authenticator...</p>
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
import { type UnregisteredUser } from '~~/types/auth/user/session/unregistered';
import { type VerifiedUnregisteredLinkableData } from '~~/types/auth/user/session/unregistered';

const { user, session, getNewSession } = useAuthState()

const UnregisteredUser = user.value as UnregisteredUser

if (!UnregisteredUser) {
    console.error('No unregistered user found')
    navigateTo('/register')
}

// Pre-verified session data
const linkableUsersData = ref(session.value.linkable_data);

if (!linkableUsersData.value) {
    console.error('No linkable data found')
    navigateTo('/register')
}

// Verified session data
const verifiedLinkableData = ref(session.value.linkable_data as VerifiedUnregisteredLinkableData);
const isVerified = ref(verifiedLinkableData.value.linkable_users !== undefined)

const sentVerification = ref(false)
const errorSendingVerification = ref(false)
const errorSendingVerificationMessage = ref('')
const sendVerificationOTP = async () => {
    sentVerification.value = false
    errorSendingVerification.value = false
    errorSendingVerificationMessage.value = ''

    try {
        const response = await $fetch('/api/v1/auth/verification/linking/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        sentVerification.value = true   
    }
    catch (error: any) {
        errorSendingVerification.value = true
        errorSendingVerificationMessage.value = error.data.message
    }
}

const otpCode = ref('')
const verifiedOTPId = ref(0)
const errorVerifyingOtp = ref(false)
const errorVerifyingOtpMessage = ref('')
const verifyOTP = async () => {
    try {
        const response = await $fetch('/api/v1/auth/verification/linking/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                otp: otpCode.value
            }
        })

        verifiedOTPId.value = response.otp_id

        isVerified.value = true

        await getNewSession()
    }
    catch (error: any) {
        errorVerifyingOtp.value = true
        errorVerifyingOtpMessage.value = error.data.message
    }
}

const errorLinkingProvider = ref(false)
const errorLinkingProviderMessage = ref('')
const linkProvider = async (userIndex: number) => {
    try {
        if (!verifiedLinkableData.value) {
            throw new Error('Linkable data not found')
        }

        const response: any = await $fetch('/api/v1/auth/register/link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp_id: verifiedOTPId.value,
                existing_user_index: userIndex
            })
        })

        await getNewSession()
        navigateTo('/')
    }
    catch (error: any) {
        errorLinkingProvider.value = true
        errorLinkingProviderMessage.value = error.data.message
    }
}
</script>

<style lang="scss" scoped>
.users {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
</style>