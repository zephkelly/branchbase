<template>
    <div class="page wrapper-container">
        <h1>Register</h1>
        <AuthState>
            <template #default="{ user, loggedIn, clear }">
            <form v-if="loggedIn" @submit.prevent="register">
                <div v-if="isUnregisteredUser(user)" class="unregistered">
                    <p>You are signing up through {{ user.provider }}</p>
                    <p v-if="user.provider === 'github'">User {{ user.username }}</p>
                    <div class="field-container email">
                        <div v-if="user.provider === 'credentials'" class="new-registration">
                            <div class="field">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required v-model="userEmail">
                            </div>
                        </div>
                        <div v-else class="oauth-registration">
                            <div class="field">
                                <p>{{ user.provider === 'google' ? 'Google' : 'GitHub' }} Logo</p>
                                <p>{{ user.primary_email }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="field-container">
                        <div v-if="user.provider === 'credentials'" class="new-registration">
                            <div class="field">
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" required v-model="password">
                            </div>
                        </div>
                        <div v-else class="oauth-registration">
                            <div class="field">
                                <label for="displayName">Display Name</label>
                                <input type="text" id="displayName" name="displayName" v-model="username" required>
                            </div>
                        </div>
                        <button type="submit">Register</button>
                    </div>
                    </div>
                    <div v-else-if="isRegisteredUser(user)" class="registered">
                    <p>You are already registered as {{ user.username }}</p>
                    <button @click.prevent="clear">Sign Out</button>
                    <div class="re-register" v-if="wantsToReRegisterChoice">
                        <button @click="showWantsToReRegisterConfirm = true">Want to register a different account?</button>
                        <div v-if="showWantsToReRegisterConfirm">
                            <p>Confirm signout?</p>
                            <button @click="wantsToReRegister(false)">No</button>
                            <button @click="wantsToReRegister(true)">Yes</button>
                        </div>
                    </div>
                </div>
            </form>
            <div v-else>
                <p>Continue with:</p>
                <button @click="signInWithGoogle">Sign in with Google</button>
                <button @click="signInWithGitHub">Sign in with GitHub</button>
            </div>
            </template>
            <template #placeholder>
            <p>Loading...</p>
            </template>
        </AuthState>
    </div>
  </template>

<script setup lang="ts">
import { isUnregisteredUser, isRegisteredUser, type UnregisteredUser, type RegisteredUser } from '~/types/auth';

const { user, clear: clearSession, fetch: getNewSession } = useUserSession()

const userEmail = computed(() => {
    if (user && user.value && isUnregisteredUser(user.value)) {
        return (user.value as UnregisteredUser).primary_email
    }
    else {
        return ''
    }
})

const password = ref('')

const username = ref<string>('')
const router = useRouter()

const signInWithGoogle = async () => {
    await clearSession();
    window.location.href = '/api/auth/google'
}

const signInWithGitHub = async () => {
    await clearSession();
    window.location.href = '/api/auth/github'
}

const showWantsToReRegisterConfirm = ref<boolean>(false);
const wantsToReRegisterChoice = ref<boolean>(false);

const alreadyRegistered = computed(() => {
    if (user && user.value) {
        if (isUnregisteredUser(user.value)) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
})

const wantsToReRegister = async (option: boolean) => {
    if (option) {
        console.log("User wants to re-register with a different account");
        wantsToReRegisterChoice.value = true;
        await clearSession();
    }
    else {
        console.log("User does not want to re-register with a different account");
        wantsToReRegisterChoice.value = false;
    }
}

const register = async () => {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.value,
            }),
        })

        if (!response.ok) {
            throw new Error('Registration failed')
        }

        const data = await response.json()

        await getNewSession()

        router.push('/')
    }
    catch (error) {
        console.error('Error during registration:', error)
        // Handle error (e.g., show error message to user)
    }
}

if (user && user.value) {
    if (alreadyRegistered.value) {
        console.log("User is already registered, maybe they want to make a new account?");
        wantsToReRegisterChoice.value = true;
    }
    else {
        console.log("User is not finished registering, continue with registration");
    }
}
else {
    console.log("New user is trying to signup");
}
</script>

<style scoped>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .re-register {
        margin-top: 2rem;
    }
</style>