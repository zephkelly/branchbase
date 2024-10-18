<template>
    <div class="page wrapper-container">
        <button @click="signInWithGoogle">Google Sign-in</button>
        <button @click="signOut">Sign Out</button>
        <AuthState>
            <template #default="{ loggedIn, clear }">
                <div v-if="loggedIn && isRegisteredUser">
                    <p>Logged in as {{ userData?.display_name }}</p>
                    <img :src="userData?.picture" alt="User Picture" />
                    <p>Session: {{ session }}</p>
                </div>
                <div v-else-if="loggedIn && !isRegisteredUser">
                    <p>Logged in as {{ userData?.email }}</p>
                    <p>Session: {{ session }}</p>
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