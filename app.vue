<template>
    <main>
        <button @click="signInWithGoogle">Google Sign-in</button>
        <button @click="signOut">Sign Out</button>
    </main>
</template>

<script setup lang="ts">
const { loggedIn, user, session, fetch, clear } = useUserSession()

const signInWithGoogle = async () => {
    await clear();
    window.location.href = '/api/auth/google'
}

const signOut = () => {
    clear();
}

console.log('session', session)
</script>