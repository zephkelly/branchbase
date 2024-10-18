<template>
    <div class="page wrapper-container">
        <AuthState>
            <template #default="{ loggedIn, clear }">
                <div v-if="loggedIn && isRegisteredUser">
                    <p>Logged in as {{ userData?.display_name }}</p>
                    <img :src="userData?.picture" alt="User Picture" />
                    <p>Session: {{ session }}</p>
                    <button @click="signOut">Sign Out</button>
                </div>
                <div v-else-if="loggedIn && !isRegisteredUser">
                    <p>Logged in as {{ userData?.email }}</p>
                    <p>Session: {{ session }}</p>
                    <NuxtLink to="/register">Finish Signing up</NuxtLink>
                </div>
                <div v-else>
                    <button @click="signInWithGoogle">Sign in with Google</button>
                </div>
            </template>
            <template #placeholder>
                <p>Loading...</p>
            </template>
        </AuthState>
    </div>
</template>

<script setup lang="ts">
import { type RegisteredUser, type UnregisteredUser, type AnyUser } from '~/types/auth';

const { user, session, clear } = useUserSession()

const isRegisteredUser = computed(() => user.value !== null && !user.value.hasOwnProperty('registered'))

const userData = computed(() => user.value as AnyUser)

const signInWithGoogle = async () => {
    await clear();
    window.location.href = '/api/auth/google'
}

const signOut = () => {
    clear();
}
</script>