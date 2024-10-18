<template>
    <div class="page wrapper-container">
        <button @click="signInWithGoogle">Google Sign-in</button>
        <button @click="signOut">Sign Out</button>
        <div v-if="loggedIn">
            <p>Logged in as {{ user?.email }}</p>
            <img :src="user?.picture" alt="User Picture" />
            <p>Session: {{ session }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const { loggedIn, user, session, clear } = useUserSession()

const userExistsStatus = ref<string>('Checking...')

const signInWithGoogle = async () => {
    await clear();
    window.location.href = '/api/auth/google'
}

const signOut = () => {
    clear();
    userExistsStatus.value = 'No user logged in...'
}
</script>