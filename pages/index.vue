<template>
    <div class="page wrapper-container">
        <h1>Welcome to Upbranched</h1>
        <AuthState>
            <template #default="{ user, loggedIn, clear }">
            <div v-if="loggedIn && isRegisteredUser(user)">
                <h2>Welcome, {{ (user as RegisteredUser).username }}!</h2>
                <img :src="(user as RegisteredUser).picture" alt="User Picture" />
                <p>Provider: {{ (user as RegisteredUser).provider }}</p>
                <button @click="signOut">Sign Out</button>
            </div>
            <div v-else-if="loggedIn && !isRegisteredUser(user)">
                <h2>Complete Your Registration</h2>
                <p>You've started the signup process through {{ (user as UnregisteredUser).provider }}</p>
                <NuxtLink to="/register" class="button">Finish Signing Up</NuxtLink>
                <button @click="cancelRegistration">Cancel Registration</button>
            </div>
            <div v-else>
                <h2>Sign In</h2>
                <button @click="signInWithGoogle" class="auth-button google">Sign in with Google</button>
                <button @click="signInWithGitHub" class="auth-button github">Sign in with GitHub</button>
                <button @click="signInWithDiscord" class="auth-button discord">Sign in with Discord</button>
                <NuxtLink to="/register" class="button">Register with Email</NuxtLink>
            </div>
            </template>
            <template #placeholder>
            <p>Loading...</p>
            </template>
        </AuthState>
    </div>
  </template>

<script setup lang="ts">
import { type RegisteredUser, type UnregisteredUser, isRegisteredUser} from '~/types/auth';

const { user, session, clear } = useUserSession()

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