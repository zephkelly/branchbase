<template>
    <div class="page wrapper-container">
        <section class="register default">
            <Authenticator>
                <template #public>
                    <h1 class="title">Create an account</h1>
                    <div class="oauth">
                        <button class="auth-button google" @click="registerWithGoogle">Sign up with Google</button>
                        <button class="auth-button github" @click="registerWithGitHub">Sign up with GitHub</button>
                        <button class="auth-button discord" @click="registerWithDiscord">Sign up with Discord</button>
                    </div>
                    <div class="divider">
                        <span class="line"></span>
                        <p>or</p>
                        <span class="line"></span>
                    </div>
                    <div class="credentials">
                        <h2>Sign up with email</h2>
                        <form @submit.prevent="registerWithCredentials">
                            <div class="input email">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" v-model="emailInput" required />
                                <p class="input-tip error"></p>
                            </div>
                            <div>
                                <label for="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    required 
                                    v-model="passwordInput"
                                    @input="handlePasswordInput"
                                />
                                <p class="input-tip error"></p>
                            </div>
                            <div class="input confirm">
                                <label for="confirm-password">Confirm Password</label>
                                <input 
                                    type="password" 
                                    id="confirm-password" 
                                    name="confirm-password" 
                                    required 
                                    v-model="confirmPasswordInput"
                                    :disabled="!isConfirmEnabled"
                                />
                            </div>
                            <ClientOnly>
                                <button 
                                    type="submit"
                                    :disabled="!!registerCredentialsErrorMessage || !isConfirmEnabled || !isSubmitEnabled"
                                >
                                    Create Account
                                </button>
                            </ClientOnly>
                            <p class="input-tip error">{{ registerCredentialsErrorMessage }}</p>
                            <NuxtLink to="/">Trying to sign in?</NuxtLink>
                        </form>
                    </div>
                </template>
            </Authenticator>
        </section>
    </div>
</template>

<script setup lang="ts">
import { Provider } from '~~/types/auth/user/providers';
import { isRegisteredUser } from '~~/types/auth/user/session/registered';
import debounce from '~~/utils/debounce';

const { clearSession, getNewSession, session, user } = useAuthState();

const registerWithGoogle = async () => {
    await clearSession();
    window.location.href = '/api/v1/auth/google'
}

const registerWithGitHub = async () => {
    await clearSession();
    window.location.href = '/api/v1/auth/github'
}

const registerWithDiscord = async () => {
    await clearSession();
    window.location.href = '/api/v1/auth/discord'
}

const emailInput = ref('');
const passwordInput = ref('');
const confirmPasswordInput = ref('');
const isConfirmEnabled = ref(false);

const isSubmitEnabled = ref(false);

const registerCredentialsErrorMessage = ref('');

const handlePasswordInput = () => {
    if (passwordInput.value.length >= 6) {
        isConfirmEnabled.value = true;
    } else {
        isConfirmEnabled.value = false;
        confirmPasswordInput.value = '';
    }
}

const debouncedPasswordCheck = debounce((password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
        registerCredentialsErrorMessage.value = 'Passwords do not match';
        isSubmitEnabled.value = false;
    }
    else {
        registerCredentialsErrorMessage.value = '';
        isSubmitEnabled.value = true;
    }
}, 1500);

watch([passwordInput, confirmPasswordInput], ([password, confirmPassword]) => {
    if (!isConfirmEnabled.value || !confirmPassword) {
        registerCredentialsErrorMessage.value = '';
        isSubmitEnabled.value = false;
        debouncedPasswordCheck.clear();
        return;
    }

    if (password === confirmPassword) {
        registerCredentialsErrorMessage.value = '';
        isSubmitEnabled.value = true;
        debouncedPasswordCheck.clear();
        return;
    }

    debouncedPasswordCheck(password, confirmPassword);
});

const registerWithCredentials = async () => {
    registerCredentialsErrorMessage.value = '';

    try {
        await clearSession();

        await $fetch('/api/v1/auth/credentials', {
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
        console.log(session.value);
        navigateTo('/register/credentials');
    }
    catch (error: any) {
        if (error.statusCode === 400) {
            if (error.statusMessage === 'Invalid or missing credentials') {
                registerCredentialsErrorMessage.value = 'Please enter a valid email and password';
                return;
            }

            registerCredentialsErrorMessage.value = error.statusMessage;
        }

        if (error.statusCode === 409) {
            registerCredentialsErrorMessage.value = 'An account with this email already exists';
        }

        if (error.statusCode === 500) {
            registerCredentialsErrorMessage.value = 'An error occurred while creating your account, please try again. If the error persists, please contact support.';
        }
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
            color: rgb(173, 0, 0);
        }

        button {
            height: 2rem;
        }
    }
}
</style>