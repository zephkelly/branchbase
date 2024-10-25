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
                <NuxtLink to="/register" class="button">Register with Email</NuxtLink>
            </template>
            <template #loading>
                <p>Loading...</p>
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
import Authenticator from '@/components/Authenticator.vue';

const { clear } = useUserSession()

const signInWithGoogle = async () => {
    await clear();
    window.location.href = '/api/auth/google'
}

const signInWithGitHub = async () => {
    await clear();
    window.location.href = '/api/auth/github'
}

const signInWithDiscord = async () => {
    await clear();
    window.location.href = '/api/auth/discord'
}

const signOut = () => {
    clear();
}

const cancelRegistration = () => {
  clear();
};
</script>