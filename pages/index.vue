<!-- THIS ENTIRE FILE NEEDS TO BE RE-WRITTEN TO USE AuthState component -->
<!-- This page CANNOT be cached or prendered -->
<template>
    <div class="page wrapper-container">
        <AuthState>
            <template #default="{ user, loggedIn, clear }">
                <div v-if="loggedIn && isRegisteredUser(user)">
                    <p>Logged in as {{ (user as RegisteredUser).display_name }}</p>
                    <img :src="(user as RegisteredUser).picture" alt="User Picture" />
                    <p>Session: {{ session }}</p>
                    <button @click="signOut">Sign Out</button>
                </div>
                <div v-else-if="loggedIn && isRegisteredUser(user) === false">
                    <p>Partial signup through {{ (user as UnregisteredUser)?.provider }}</p>
                    <NuxtLink to="/register">Finish Signing up</NuxtLink>
                    <button @click="clear">Cancel</button>
                </div>
                <div v-else>
                    <button @click="signInWithGoogle">Sign in with Google</button>
                    <button @click="signIntWithGitHub">Sign in with GitHub</button>
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

const signIntWithGitHub = async () => {
    await clear();
    window.location.href = '/api/auth/github'
}

const signOut = () => {
    clear();
}
</script>