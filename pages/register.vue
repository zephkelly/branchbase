<template>
    <div class="page wrapper-container">
        <h1>Register</h1>
        <div v-if="alreadyRegistered && wantsToReRegisterChoice !== false" class="oauth-buttons">
            <button @click="signInWithGoogle">Link Google</button>
        </div>
        <form @submit.prevent="register">
            <p v-if="user">You are signing up through {{ (user as UnregisteredUser).provider }} with email {{ (user as UnregisteredUser).email }}</p>
            <div class="field-container email">
                <div v-if="user === null" class="new-registration">
                    <div class="field">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required v-model="userEmail">
                    </div>
                </div>
                <div v-if="user !== null && (user as UnregisteredUser).provider !== 'credentials'" class="oauth-registration">
                    <div class="field">
                        <p> Imagine this is the {{ (user as UnregisteredUser).provider }} logo</p>
                        <p>{{ (user as UnregisteredUser).email }}</p>
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
                <div v-if="user !== null && (user as UnregisteredUser).provider !== 'credentials'" class="oauth-registration">
                    <div class="field">
                        <label for="displayName">Display Name</label>
                        <input type="text" id="displayName" name="displayName" v-model="displayName" required>
                    </div>
                </div>
                <button type="submit">Register</button>
            </div>
        </form>
        <ClientOnly>        
            <div class="re-register" v-if="alreadyRegistered && wantsToReRegisterChoice !== false">
                <button @click="showWantsToReRegisterConfirm = true">Already logged in, want to Register with a different account?</button>
                <div v-if="showWantsToReRegisterConfirm">
                    <p>Are you sure you want to register with a different account?</p>
                    <button @click="wantsToReRegister(false)">No</button>
                    <button @click="wantsToReRegister(true)">Yes</button>
                </div>
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { isUnregisteredUser, type UnregisteredUser } from '~/types/auth';

const { user, clear: clearSession, fetch: getNewSession } = useUserSession()
const userEmail = ref<string>((user?.value as UnregisteredUser).email || '')
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

onBeforeMount(() => {
    if (alreadyRegistered.value) {
        console.log("User is already registered, maybe they want to make a new account ? Display modal asking if they want to make a new account or return with their existing account");
        wantsToReRegisterChoice.value = true;
    }
    else {
        console.log("User is not finished registering, continue with registration");
    }
})
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