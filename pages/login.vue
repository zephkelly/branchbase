<template>
  <section class="login-panel">
    <div class="login">
      <form @submit.prevent="submitCredsLogin(), disableMessageLogin()">
        <h1>Log in below</h1>
        <div class="wrapper oauth">
          <a v-on:click="handleGithubSignIn" alt="Connect your GitHub account" title="Connect your GitHub account">
            <svg viewBox="0 0 128 128">
              <g fill="#d6d6d6"><path fill-rule="evenodd" clip-rule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"></path><path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path></g>
            </svg>
            Continue with GitHub
          </a>
          <a class="oauth discord" v-on:click="handleDiscordSignIn" alt="Sign in with your Discord account" title="Sign in with your Discord account[]">
            <svg width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#ffffff">
              <g id="SVGRepo_bgCarrier" stroke-width="0"/>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
              <g id="SVGRepo_iconCarrier"> <g> <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#ffffff" fill-rule="nonzero"> </path> </g> </g>
            </svg>
            Continue with Discord
          </a>
          <a class="oauth google" v-on:click="handleGoogleSignIn" alt="Sign in with your Google account" title="Sign in with your Google account">
            <svg viewBox="0 0 128 128">
              <path fill="#fff" d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"></path><path fill="#e33629" d="M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z"></path><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z"></path><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"></path><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z"></path>
            </svg>
            Continue with Google
          </a>
        </div>
        <p class="or">OR</p>
        <div class="wrapper regular">
          <div>
            <label class="animated-label email" ref="emailLabel" for="email">Email</label>
            <input
              v-on:focus="toggleLable('email', true, true)"
              v-on:focusout="toggleLable('email', false, true)"
              v-on:input="canSubmitLogin"
              class="email" v-model="emailInput" ref="emailInputRef" type="email" required/>
          </div>
          <div>
            <label class="animated-label password" ref="passwordLabel" for="password">Password</label>
            <input
              v-on:focus="toggleLable('password', true, true)"
              v-on:focusout="toggleLable('password', false, true)"
              v-on:input="canSubmitLogin"
              class="email" v-model="passwordInput" ref="passwordInputRef" type="password" required/>
          </div>
          <!-- -->
          <button ref="loginSubmit" class="email-login disabled" alt="Sign up with your email" title="Sign up with your email">Log in</button>
          <p v-if="showErrorLogin" class="error initial">{{ errorMessageInitial }}</p>
          <p v-if="showMessageLogin" class="message initial">{{ messageLogin }}</p>
          <p class="swap">Need to sign up? <nuxt-link to="/register">Register here</nuxt-link></p>
        </div>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { SessionData } from 'h3';
const { status, data, signIn } = useAuth();

const route = useRoute();
const router = useRouter();

const showErrorLogin: Ref = ref(false);
const showMessageLogin: Ref = ref(false);
const errorMessageInitial: Ref = ref('');
const messageLogin: Ref = ref('');

const loginSubmit: Ref = ref(null);

const emailInput: Ref = ref(null);
const emailInputRef: Ref = ref(null);
const emailLabel: Ref = ref(null);

const passwordInput: Ref = ref(null);
const passwordInputRef: Ref = ref(null);
const passwordLabel: Ref = ref(null);

onBeforeMount(async () => {
  if (status.value === 'authenticated') {
    const profile = await getUserProfile(await Promise.resolve(data.value) as SessionData);

    if (profile == null) {
      const provider: string = route.query.provider as string;

      if (provider === undefined || provider === null) {
        return;
      }

      router.push(`/register?authSignup=true&provider=${provider}`);
    }
    else {
      router.push('/');
    }
  }

  if (route.query.message === 'signedUpOAuth') {
    showMessageLogin.value = true;
    messageLogin.value = 'You have signed up! Please log in to continue.';
    await history.pushState({}, '', '/login');
  }
  else if (route.query.message === 'signedUpCreds') {
    showMessageLogin.value = true;
    messageLogin.value = 'You have signed up successfully! Please log in to continue.';
    await history.pushState({}, '', '/login');
  }

  if (route.query.callbackUrl) {
    showErrorLogin.value = true;
    errorMessageInitial.value = 'Sorry, there was an issue. Try to sign in with a different provider.';
    await history.pushState({}, '', '/login');
  }

  if (emailInput.value) {
      emailLabel.value.classList.add('focus');
    }
  if (passwordInput.value) {
    passwordLabel.value.classList.add('focus');
  }
});

//Input label toggling
let isEmailFocused = false;
let isPasswordFocused = false;
function toggleLable(label: string, shouldToggle: boolean, isFocused: boolean = false) {
  let currentLabel: any = null;
  let currentInput: any = null;

  switch (label) {
    case 'email':
      currentLabel = emailLabel;
      currentInput = emailInput;
      
      if (isFocused) {
        isEmailFocused = !isEmailFocused;
      }

      toggle(isEmailFocused);
      break;
    case 'password':
      currentLabel = passwordLabel;
      currentInput = passwordInput;

      if (isFocused) {
        isPasswordFocused = !isPasswordFocused;
      }

      toggle(isPasswordFocused);
      break;
    default:
      break;
  }

  function toggle(inputFocused: boolean) {
    if (shouldToggle) {
      currentLabel.value.classList.add('focus');
      return;
    }
    else {
      if (inputFocused) return;

      if (currentInput.value === null || currentInput.value === '') {
        currentLabel.value.classList.remove('focus');
        return;
      }
    }
  }
}

async function handleGoogleSignIn() {
  await signIn('google', { callbackUrl: '/login?provider=google' });
}

async function handleGithubSignIn() {
  await signIn('github', { callbackUrl: '/login?provider=github' });
}

async function handleDiscordSignIn() {
  await signIn('discord', { callbackUrl: '/login?provider=discord' });
}


const emailRegex = /.+@.+/;
async function submitCredsLogin() {
  const email: string = emailInput.value;
  const password: string = passwordInput.value;

  const result = await signIn('credentials', { email, password, redirect: false })

  if (result) {
    if (result.error === 'CredentialsSignin') {
      emailInputRef.value.classList.add('invalid');
      emailInputRef.value.classList.remove('valid');

      passwordInputRef.value.classList.add('invalid');
      passwordInputRef.value.classList.remove('valid');

      showErrorLogin.value = true;
      errorMessageInitial.value = 'Invalid email or password. Did you sign up with a different provider?';
    }
    else {
      showErrorLogin.value = true;
      errorMessageInitial.value = 'Sorry, there was an issue. Try to sign in with a different provider.';
    }
  } else {
    return navigateTo('/', { external: true })
  }
}

function canSubmitLogin() {
  if (!emailRegex.test(emailInput.value)) {
    emailInputRef.value.classList.add('invalid');
    emailInputRef.value.classList.remove('valid');
    loginSubmit.value.classList.add('disabled');
    return;
  }

  if (passwordInput.value !== null && passwordInput.value.length < 8) {
    passwordInputRef.value.classList.add('invalid');
    passwordInputRef.value.classList.remove('valid');
    loginSubmit.value.classList.add('disabled');
    return;
  }

  emailInputRef.value.classList.add('valid');
  emailInputRef.value.classList.remove('invalid');

  passwordInputRef.value.classList.add('valid');
  passwordInputRef.value.classList.remove('invalid');

  loginSubmit.value.classList.remove('disabled');
}

async function getUserProfile(sessionData: SessionData): Promise<any> {
  const response = await useFetch(`/api/auth/check-user?email=${sessionData.user.email}`);
  const data: any = await response.data.value;

  if (data.body.userExists) {
    return data.body
  }

  return null;
}

function disableMessageLogin() {
  showMessageLogin.value = false;
  messageLogin.value = '';
}

definePageMeta({
  auth: false,
  layout: 'center-align',
}) 
</script>

<style lang="scss" scoped>
h1 {
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
  align-self: flex-start;
}
.login-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: clamp(6.4rem, 18vw, 12rem) 0rem;
  width: 340px;
  height: auto;
  border: 1px solid var(--panel-border-color);
  background-color: var(--panel-color);
  padding: 3.5rem 2rem;
  box-sizing: border-box;

  div {
    width: 100%;
  }

  .login {
    height: 100%;
  }

  * {
    font-family: 'Roboto', sans-serif;
    color: var(--text-color);
    box-sizing: border-box;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;

    .wrapper {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }

    p.or {
      font-size: 0.8rem;
      font-weight: 500;
      margin: 2rem 0;
      margin-top: 3.2rem;
      cursor: default;
      user-select: none;
    }

    p.swap {
      margin-top: 4rem;
      font-size: 0.8rem;
      font-weight: 500;
      // align-self: flex-start;

      a {
        cursor: pointer;
        text-decoration: underline;
        transition: color 0.15s ease-in-out;
        color: var(--accent-color);
        
        &:hover {
          color: var(--text-color);
        }
      }
    }

    .wrapper.oauth {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.1rem;
      height: auto;

      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 3rem;
        padding: 0.8rem;
        background-color: var(--background-color);
        border: 1px solid var(--panel-border-color);
        border-radius: 1.5rem;
        cursor: pointer;
        transition: border-color 0.15s ease-in-out;

        &:hover {
          border-color: var(--panel-border-hover-color);
        }

        &.discord {
          background-color: #5669ae;
          color: #fff;

          &:hover {
            border-color: var(--panel-border-light);
          }
        }

        &.google {
          margin-bottom: 0;
          background-color: var(--panel-color-light);
          border-color: var(--panel-border-light);
          color: var(--text-color-light);
        }

        svg {
          position: absolute;
          left: 0.7rem;
          width: 1.5rem;
          height: 1.5rem;

          &:first-child {
            width: 1.85rem;
            height: 1.85rem;
          }
        }
      }
    }

    label {
      pointer-events: none;
      align-self: flex-start;
    }

    .animated-label {
      position: absolute;
      font-size: 1rem;
      color: var(--text-color);
      transform: translate3d(1rem, 1.75rem, 0);
      transition: transform 0.1s cubic-bezier(0.075, 0.82, 0.165, 1), font-size 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
      opacity: 0.4;
      z-index: 1;

      &.email {
        top: -1rem;
        left: 0rem;
      }

      &.password {
        top: 3.15rem;
        left: 0rem;
      }

      &.focus {
        transform: translate3d(0.8rem, -0.1rem, 0);
        font-size: 0.8rem;
        opacity: 1;
      }
    }

    input {
      background-color: var(--background-color);
      border: 1px solid var(--panel-border-color);
      border-radius: 1rem;
      padding: 0.8rem;
      margin-bottom: 1.6rem;
      height: 2.5rem;
      width: 100%;
      transition: border 0.1s ease-out;
      font-size: 1rem;
      z-index: 0;

      &:focus {
        outline: none;
        border: 1px solid var(--input-focus-color);
      }
    }

    .email-login {
      font-size: 1.1rem;
      width: 100%;
      height: 2.5rem;
      border-radius: 1rem;
    }
  }
}

p.error {
  align-self: center;
  color: rgba(255, 0, 0, 0.756);
  position: absolute;
  top: 11.5rem;
  line-height: 1rem;
  font-size: 0.8rem;
  text-align: center;
}

p.message {
  align-self: center;
  margin-bottom: 1rem;
  color: rgba(0, 255, 0, 0.756);
  position: absolute;
  top: 11.5rem;
  font-size: 0.8rem;
  text-align: center;
}
</style>