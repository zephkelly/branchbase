<template>
    <div class="page wrapper-container">
        <h1>Register</h1>
        <Authenticator>
            <template #unregistered="{ user, session }">
                <section v-if="isVerified" class="registration-container verified">
                    <h2>Linkable Users</h2>
                </section>
                <section v-else class="registration-container">
                    <div v-if="hasLinkableUsers && !noLinkQuery && !showLinkAccounts" class="linkable">
                        <div v-if="userWantsToLinkAccounts">
                            <h2>Link to existing account</h2>
                            <p>We found other accounts using the email: {{ linkableUsersData.provider_email  }} </p>
                            <p>Do you want to link an email and password login to an existing account?</p>
                            <button @click="showLinkAccounts = false; userWantsToLinkAccounts = false;">No</button>
                            <button @click="showLinkAccounts = true;">Yes</button>
                        </div>
                        <div v-else>
                            <button @click="showLinkAccounts = false; userWantsToLinkAccounts = true;">Back</button>
                        </div>
                    </div>
                    <div v-if="hasLinkableUsers && !noLinkQuery && showLinkAccounts" class="verify">
                        <button @click="showLinkAccounts = false;">Back</button>
                        <h2>Let's confirm your password</h2>
                        <form @submit.prevent="" style="display: flex; flex-direction: column; gap: 1rem;">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required v-model="unregisteredUser.provider_email" disabled />
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required v-model="passwordInput" />
                            <label for="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" name="confirm-password" required v-model="confirmPasswordInput" />
                            <button @click="submitUnregisteredLinkableCredentials()">Submit</button>
                        </form>
                    </div>


                    <!-- <h2>Create an account</h2>
                    <button @click="changeCredentials()">Sign up with a different account</button>
                    <form @submit.prevent="submitUnregisteredSession">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required v-model="unregisteredUser.provider_email" disabled />

                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required v-model="unregisteredUser.username" />

                        <p>We need to confirm your password</p>
                        <label for="passwordInput">Password</label>
                        <input type="password" id="passwordInput" name="passwordInput" required v-model="passwordInput"/>

                        <label for="confirm-passwordInput">Confirm Password</label>
                        <input type="password" id="confirm-passwordInput" name="confirm-passwordInput" required v-model="confirmPasswordInput"/>

                        <button type="submit">Create Account</button>
                    </form> -->
                </section>
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
// import { Provider, type LinkableData, type UnregisteredUser } from '~~/types/user';
import { Provider } from '~~/types/auth/user/providers';
import { type UnregisteredUser, type UnregisteredLinkableData } from '~~/types/auth/user/session/unregistered';

const router = useRouter()
const route = useRoute()

// Session data --------------------------------------------------------------
const { user, session, getNewSession, clearSession } = useAuthState()

const unregisteredUser = ref(user.value as UnregisteredUser);
const linkableUsersData = ref(session.value.linkable_data as UnregisteredLinkableData);

const hasLinkableUsers = ref(linkableUsersData.value !== null && linkableUsersData.value?.existing_users_count > 0)
const noLinkQuery = ref(route.query.nolink === 'true')

const showLinkAccounts = ref(false)
const userWantsToLinkAccounts = ref(true)

const isVerified = ref(unregisteredUser.value?.provider_verified)

// Check if the redirect came from login ------------------------------------
const isFromLogin = ref(route.query.from === 'login')

if (isFromLogin.value) {
    router.replace({ query: {} })
}


// Check if the user is actually unregistered --------------------------------
if (!unregisteredUser.value || !linkableUsersData.value) {
    console.error('No unregistered user found')
    navigateTo('/register')
}
else {
    // If they are already registered, redirect to the home page --------------
    if (unregisteredUser.value.id !== null) {
        console.log('User is registered:')
        navigateTo('/')
    }
    // If they are not a credentials user redirect them to OAuth --------------
    else
    if (unregisteredUser.value.provider !== Provider.Credentials) {
        console.log('OAuth unregistered user found:', unregisteredUser.value)
        navigateTo('/register/oauth')
    }
}


// Submit credentials to initiate account linking -----------------------------
const passwordInput = ref('')
const confirmPasswordInput = ref('')

async function submitUnregisteredLinkableCredentials() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        alert('Passwords do not match')
        return
    }

    const response = await $fetch('/api/auth/register/credentials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: unregisteredUser.value.provider_email,
            password: passwordInput.value,
            confirm_password: confirmPasswordInput.value
        }),
    });

    if (response.statusCode === 200) {
        await getNewSession()

        if (session.value.confirmed_password) {
            navigateTo('/register/link')
        }
    }
    else {
        console.log(response)
        alert('Invalid credentials')
    }
}
</script>