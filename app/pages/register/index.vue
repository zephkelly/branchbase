<template>
    <div class="page wrapper-container">
        <Authenticator>
            <template #public>
                <section class="register default">
                    <h1 class="title">Create an account</h1>
                    <div class="oauth">
                        <button class="auth-button google" @click="signInWithGoogle">Sign up with Google</button>
                        <button class="auth-button github" @click="signInWithGitHub">Sign up with GitHub</button>
                        <button class="auth-button discord" @click="signInWithDiscord">Sign up with Discord</button>
                    </div>
                    <div class="divider">
                        <span class="line"></span>
                        <p>or</p>
                        <span class="line"></span>
                    </div>
                    <div class="credentials">
                        <h2>Sign up with email</h2>
                        <form @submit.prevent="signInWithCredentials">
                            <div class="input email">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required v-model="emailInput" />
                                <p class="input-tip error"></p>
                            </div>
                            <div>
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" required v-model="passwordInput" />
                                <p class="input-tip error"></p>
                            </div>
                            <div class="input confirm">
                                <label for="confirm-password">Confirm Password</label>
                                <input type="password" id="confirm-password" name="confirm-password" required v-model="confirmPasswordInput" />
                            </div>
                            <button type="submit">Create Account</button>
                        </form>
                    </div>
                </section>
            </template>
        </Authenticator>
    </div>
</template>

<script setup lang="ts">
import { Provider } from '~~/types/auth/user/providers';
import { isRegisteredUser } from '~~/types/auth/user/session/registered';

const { clearSession, getNewSession, session, user } = useAuthState();

const signInWithGoogle = async () => {
    await clearSession();
    window.location.href = '/api/auth/google'
}

const signInWithGitHub = async () => {
    await clearSession();
    window.location.href = '/api/auth/github'
}

const signInWithDiscord = async () => {
    await clearSession();
    window.location.href = '/api/auth/discord'
}
console.log(session.value)

const emailInput = ref('');
const passwordInput = ref('');
const confirmPasswordInput = ref('');

const signInWithCredentials = async () => {
    try {
        await clearSession();

        const response = await $fetch('/api/auth/credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value,
                confirm_password: confirmPasswordInput.value,
            }),
        });

        await getNewSession();
        navigateTo('/register/credentials');
    }
    catch (error: any) {
        console.error('Error signing in:', error);
    }
}

if (user.value) {
    if (isRegisteredUser(user.value)) {
        navigateTo('/');
    }

    if (user.value.provider === Provider.Credentials) {
        navigateTo('/register/credentials');
    }
    else {
        navigateTo('/register/oauth');
    }
}
</script>

<style lang="scss" scoped>
.page {
    width: 100%;
    min-height: calc(100vh - 1rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 2rem;
}

section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border: 1px solid #ccc;
    padding-bottom: 10rem;
    margin-top: 2rem;
    margin-bottom: 6rem;
    width: 300px;
    padding: 1rem 1rem;
}

h1, h2 {
    margin-top: 0rem;
}

.oauth {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    button {
        height: 2rem;
    }
}

.divider {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1.5rem 0rem;

    .line {
        width: 40%;
        height: 1px;
        background-color: #ccc;
    }

    p {
        margin: 0rem 1rem;
    }
}

.credentials {
    width: 100%;

    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        div {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
        }

        .input {
            &.email {
                margin-bottom: 0.5rem;
            }
            &.confirm {
                margin-bottom: 0.5rem;
            }
        }

        p.input-tip {
            margin: 0rem;
            color: red;
        }

        button {
            height: 2rem;
        }
    }
}
</style>