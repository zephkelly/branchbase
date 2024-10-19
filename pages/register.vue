<!-- THIS ENTIRE FILE NEEDS TO BE RE-WRITTEN TO USE AuthState component -->
<!-- This page CANNOT be cached or prendered -->
<template>
    <div class="page wrapper-container">
        <h1>Register</h1>
        <form v-if="user" @submit.prevent="register">
            <div v-if="isUnregisteredUser(user)" class="unregistered">
                <p>You are signing up through {{ user.provider }} with email {{ user.email }}</p>
                <div class="field-container email">
                    <div v-if="user === null" class="new-registration">
                        <div class="field">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required v-model="userEmail">
                        </div>
                    </div>
                    <div v-if="user !== null && user?.provider !== 'credentials'" class="oauth-registration">
                        <div class="field">
                            <p> Imagine this is the {{ user.provider }} logo</p>
                            <p>{{ user.email }}</p>
                        </div>
                    </div>
                </div>
                <div class="field-container password">
                    <div v-if="user === null" class="new-registration">
                        <div class="field">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                    </div>
                    <div v-if="user !== null && user.provider !== 'credentials'" class="oauth-registration">
                        <div class="field">
                            <label for="displayName">Display Name</label>
                            <input type="text" id="displayName" name="displayName" v-model="displayName" required>
                        </div>
                    </div>
                    <button type="submit">Register</button>
                </div>
            </div>
            <div v-else-if="isRegisteredUser(user)" class="registered">
                <p>You are already registered as {{ user.display_name }}</p>
                <button @click.prevent="clearSession">Sign Out</button>
                <!-- <ClientOnly> -->
                    <p>Howdy doody</p>       
                    <div class="re-register" v-if="alreadyRegistered && wantsToReRegisterChoice === true">
                        <button @click="showWantsToReRegisterConfirm = true">Want to register a different account?</button>
                        <div v-if="showWantsToReRegisterConfirm">
                            <p>Confirm signout?</p>
                            <button @click="wantsToReRegister(false)">No</button>
                            <button @click="wantsToReRegister(true)">Yes</button>
                        </div>
                    </div>
                <!-- </ClientOnly> -->
            </div>
        </form>
        <form v-else>
            <p>Continue with Google</p>
            <button @click.prevent="signInWithGoogle">Sign in with Google</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { isUnregisteredUser, isRegisteredUser, type UnregisteredUser, type RegisteredUser } from '~/types/auth';

const { user, clear: clearSession, fetch: getNewSession } = useUserSession()

const userEmail = computed(() => {
    if (user && user.value && isUnregisteredUser(user.value)) {
        return (user.value as UnregisteredUser).email
    }
    else {
        return ''
    }
})

const displayName = ref<string>('')
const router = useRouter()

const signInWithGoogle = async () => {
    await clearSession();
    window.location.href = '/api/auth/google'
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
                display_name: displayName.value,
            }),
        })

        if (!response.ok) {
            throw new Error('Registration failed')
        }

        const data = await response.json()
        console.log('User registered:', data)
        console.log(response.status)

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