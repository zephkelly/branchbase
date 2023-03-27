<template>
  <section class="register-panel">
    <Transition name="fade">
      <div v-show="initialPanel" class="register">
        <form ref="form" v-on:submit="submitRegister">
          <h1>Sign up below</h1>
          <p v-if="showError" class="error">{{ errorMessage }}</p>
          <div class="wrapper oauth">
            <a v-on:click="handleGithubSignIn" alt="Connect your GitHub account" title="Connect your GitHub account">
              <svg viewBox="0 0 128 128">
                <g fill="#d6d6d6"><path fill-rule="evenodd" clip-rule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"></path><path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path></g>
              </svg>
              Link GitHub
            </a>
            <a v-on:click="handleGoogleSignIn" alt="Connect your Google account" title="Connect your Google account">
              <svg viewBox="0 0 128 128">
                <path fill="#fff" d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"></path><path fill="#e33629" d="M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z"></path><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z"></path><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"></path><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z"></path>
              </svg>
              Link Google
            </a>
          </div>
          <p class="or">OR</p>
          <div class="wrapper regular">
            <div>
              <label class="animated-label email" ref="emailLabel" for="email">Email</label>
              <input v-on:mouseenter="toggleEmailLabel(true)" v-on:mouseleave="toggleEmailLabel(false)" v-on:focus="toggleEmailLabel(true, true)" v-on:focusout="toggleEmailLabel(false, true)" v-on:input="canSubmit" v-on:submit="submitRegister"  class="email" v-model="emailInput" type="email" required/>
            </div>
            <!-- -->
            <button ref="emailSubmit" class="email-signup disabled" alt="Sign up with your email" title="Sign up with your email">Sign up</button>
            <p class="swap">Already signed up? <nuxt-link to="/login">Log in here</nuxt-link></p>
          </div>
        </form>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-show="onboardOAuth" class="oauth-onboard">
      </div>
    </Transition>
    <Transition name="fade">
      <div v-show="onboardCredentials" class="creds-onboard">
        <h1>Create account</h1>
        <img src="" alt="" class="profile-image">
        <h3 class="display-name">{{ displayName }}</h3>
        <form ref="formOnboardCreds" v-on:submit="submitOnboardCreds">

        </form>
      </div>
    </Transition>
  </section>
</template>

<script lang="ts" setup>
import generateUsername from '@/utils/generateUsername';
const { getSession, signIn, data } = useSession();

const route = useRoute();
const router = useRouter();

const form = ref(null);
const emailSubmit: Ref = ref(null);

const showError: Ref = ref(false);
const errorMessage: Ref = ref('');

const emailLabel: Ref = ref(null);
const emailInput: Ref = ref(null);

const passwordLabel = ref(null);
const passwordInput = ref(null);

//generate a random display name
const displayName: Ref = ref(generateUsername());

const initialPanel = ref(true);
const onboardCredentials = ref(false);
const onboardOAuth = ref(false);

if (data.value?.user !== null) {
  //OAuth
  if (route.query.authSignup === 'true') {
    //@ts-expect-error
    if (await queryDatabase(data?.value?.user?.email)) {
      router.push('/');
    }

    initialPanel.value = false;
    onboardOAuth.value = true;
    //wait for user to enter their info
  }
  //Regular
  else if (route.query.authSignup === 'false') {
    
    console.log(emailInput.value);
    // router.push('/');
  }
}


let isEmailFocused = false;
const toggleEmailLabel = (shouldToggle: boolean, isFocused: boolean = false) => {
  if (isFocused) {
    isEmailFocused = !isEmailFocused;
  }

  if (shouldToggle) {
    emailLabel.value.classList.add('focus');
    return;
  }
  else {
    if (isEmailFocused) return;

    if (emailInput.value === null || emailInput.value === '') {
      emailLabel.value.classList.remove('focus');
      return;
    }
  }
};

async function submitRegister(e: Event) {
  e.preventDefault();
  
  if (emailSubmit.value.classList.contains('disabled')) return;
  
  initialPanel.value = false;
  onboardCredentials.value = true;

  if (await queryDatabase(emailInput.value)) {
    initialPanel.value = true;
    onboardCredentials.value = false;

    showError.value = true;
    errorMessage.value = 'That email is already in use';
  }
}

function submitOnboardCreds(e: Event) {
  e.preventDefault();
  
}

function canSubmit() {
  const emailRegex = /@/;
  
  if (emailRegex.test(emailInput.value) && emailInput.value !== '') {
    emailSubmit.value.classList.remove('disabled');
  }
  else {
    emailSubmit.value.classList.add('disabled');
  }

  if (showError.value = true) {
    showError.value = false;
    errorMessage.value = '';
  }
}

async function queryDatabase(email: string): Promise<boolean> {
  const response = await useFetch(`/api/auth/check-user?email=${email}`);
  const data: any = await response.data.value;

  if (data.body.userExists) {
    return true
  }

  return false;
}

const handleGithubSignIn = async () => {
  await signIn('github', {
    callbackUrl: `/register?authSignup=true&provider=github`,
  });
};

const handleGoogleSignIn = async () => {
  await signIn('google', {
    callbackUrl: `/register?authSignup=true&provider=google`,
  });
};

const handleEmailSignIn = async () => {
  const email = emailInput.value;
  const password = '';

  handleCredentialsSignIn({ email, password })
};

const handleCredentialsSignIn = async ({ email, password }: { email: string, password: string }) => {
  const { error, url } = await signIn('credentials', { email, password, redirect: false })

  if (error) {
    // Do your custom error handling here
    alert('You have made a terrible mistake while entering your credentials')
  } else {
    return navigateTo(url, { external: true })
  }
}

definePageMeta({
  auth: false,
  layout: 'center-align',
});
</script>

<style lang="scss" scoped>
h1 {
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 2rem;
  align-self: flex-start;
}

p.error {
  align-self: flex-start;
  margin-bottom: 1rem;
  color: red;
}
.register-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 14rem;
  width: 340px;
  height: 600px;
  border: 1px solid var(--panel-border-color);
  background-color: var(--panel-color);
  padding: 3.5rem 2rem;
  box-sizing: border-box;

  * {
    font-family: 'Roboto', sans-serif;
    color: var(--text-color);
    box-sizing: border-box;
  }

  .register, .oauth-onboard, .creds-onboard {
    position: absolute;
    height: calc(100% - 7rem);
    width: calc(100% - 4rem);
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto;

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
      margin: 3rem 0;
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

    .wrapper.regular {
      div {
        width: 100%;
      }
    }

    .wrapper.oauth {
      height: 6.5rem;

      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 3rem;
        margin-bottom: 0.8rem;
        padding: 0.8rem;
        background-color: var(--background-color);
        border: 1px solid var(--panel-border-color);
        border-radius: 1.5rem;
        cursor: pointer;
        transition: border-color 0.15s ease-in-out;

        &:hover {
          border-color: var(--panel-border-hover-color);
        }

        &:last-child {
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
      z-index: 1;

      &.email {
        top: -1rem;
        left: 0rem;
      }

      &.focus {
        transform: translate3d(0.8rem, -0.1rem, 0);
        font-size: 0.8rem;
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
      // letter-spacing: 0.1rem;
      font-size: 1rem;
      z-index: 0;

      &:focus {
        outline: none;
        border: 1px solid var(--input-focus-color);
      }
    }

    .email-signup {
      font-size: 1.1rem;
      font-weight: 500;
      width: 100%;
      height: 2.5rem;
      border: none;
      border-radius: 1rem;
      background-color: var(--accent-color);
      padding: 0rem;
      cursor: pointer;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;

      &.disabled {
        color: rgba(255, 255, 255, 0.286);
        background-color: var(--panel-border-color);
        pointer-events: none;
        cursor: none;
      }
    }
  }
}

.creds-onboard {
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    align-self: center;
    height: 9rem;
    width: 9rem;
    margin-top: 1rem;
    border-radius: 100%;
    background-color: rgb(187, 187, 187);
  }

  .display-name {
    margin-top: 1rem;
    font-size: 1.1rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>