<template>
    <div class="page wrapper-container">
        <h1>Welcome to Upbranched</h1>
        <Authenticator>
            <template #default="{ user }">
                <h2>Welcome, {{ user.username }}!</h2>
                <img :src="user.picture" alt="User Picture" />
                <p>Provider: {{ user.provider }}</p>
                <button @click="signOut">Sign Out</button>
            </template>
            <template #unregistered="{ user }">
                <h2>Complete Your Registration</h2>
                <p>You've started the signup process through {{ user.provider }}</p>
                <NuxtLink to="/register" class="button">Finish Signing Up</NuxtLink>
                <button @click="cancelRegistration">Cancel Registration</button>
            </template>
            <template #public>
                <h2>Sign In</h2>
                <button @click="signInWithGoogle" class="auth-button google">Sign in with Google</button>
                <button @click="signInWithGitHub" class="auth-button github">Sign in with GitHub</button>
                <button @click="signInWithDiscord" class="auth-button discord">Sign in with Discord</button>
                <div style="margin-top: 1rem;">
                    <form @submit.prevent="signInWithCredentials">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required v-model="emailInput" />
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required v-model="passwordInput" />
                        <button type="submit">Sign In</button>
                        <p v-if="isInvalidCredentialsCreateAccount">Invalid credentials. Did you want to <a href="/register/credentials?from=login">Create an Account?</a></p>
                        <p v-if="isInvalidCredentials">Incorrect email or password, please try again</p>
                    </form>
                </div>
            </template>
            <template #loading>
                <p>Loading...</p>
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
import Authenticator from '@/components/Authenticator.vue';

const { clearSession, getNewSession, session, user } = useAuthState()

const signInWithGoogle = async () => {
    await clearSession();
    window.location.href = '/api/auth/google'
}

const signInWithGitHub = async () => {
    await clearSession();
    window.location.href = '/api/auth/github'
}

const signInWithDiscord = async () => {
    await clearSession();
    window.location.href = '/api/auth/discord'
}

const signOut = () => {
    clearSession();
}

const cancelRegistration = () => {
    clearSession();
};

const emailInput = ref('');
const passwordInput = ref('');

const isInvalidCredentials = ref(false);
const isInvalidCredentialsCreateAccount = ref(false);

const signInWithCredentials = async () => {
    try {
        await clearSession();
        const response = await $fetch('/api/auth/credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value,
            }),
        });
    
        //@ts-expect-error
        if (response.registered !== undefined && response.registered === false) {
            isInvalidCredentialsCreateAccount.value = true;
            isInvalidCredentials.value = false;
            return;
        }

        await getNewSession();
        navigateTo('/');
    }
    catch (error: any) {
        console.error('Error signing in:', error);
        if (error.statusCode === 401) {
            isInvalidCredentials.value = true;
            isInvalidCredentialsCreateAccount.value = false;
        }
        else {
            isInvalidCredentialsCreateAccount.value = true;
            isInvalidCredentials.value = false;
        }
    }
}
</script>