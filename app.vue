<template>
    <main>
        <button @click="signInWithGoogle">Google Sign-in</button>
        <button @click="signOut">Sign Out</button>
        <div v-if="loggedIn">
            <p>Logged in as {{ user?.email }}</p>
            <p>Session: {{ session }}</p>
        </div>
    </main>
</template>

<script setup lang="ts">
const { loggedIn, user, session, clear } = useUserSession()

const signInWithGoogle = async () => {
    await clear();
    window.location.href = '/api/auth/google'
}

const signOut = () => {
    clear();
}
</script>