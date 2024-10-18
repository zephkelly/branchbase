<template>
    <div class="page wrapper-container">
        <AuthState>
            <template #default="{ loggedIn, clear }">
                <div v-if="loggedIn && isRegisteredUser">
                    <p>Logged in as {{ (user as RegisteredUser).display_name }}</p>
                    <img :src="(user as RegisteredUser).picture" alt="User Picture" />
                    <p>Session: {{ session }}</p>
                    <button @click="signOut">Sign Out</button>
                </div>
                <div v-else-if="loggedIn && !isRegisteredUser">
                    <p>Logged in as {{ (user as UnregisteredUser)?.email }}</p>
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
import { type RegisteredUser, type UnregisteredUser, type AnyUser, isRegisteredUser as checkIsRegisteredUser} from '~/types/auth';

const { user, session, clear } = useUserSession()

const isRegisteredUser = computed(() => checkIsRegisteredUser(user.value))

const signInWithGoogle = async () => {
    await clear();
    window.location.href = '/api/auth/google'
}

const signOut = () => {
    clear();
}
</script>