<template>
  <section ref="registerPanel" class="register-panel">
    <Transition name="fade">
      <div v-show="initialPanel" class="register">
        <form ref="form" v-on:submit="submitRegister">
          <h1 class="landing">Sign up below</h1>
          <p v-if="showErrorInitial" class="error">{{ errorMessageInitial }}</p>
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
              <input class="email" v-model="emailInput" type="email"  
                v-on:focus="toggleLable('email', true, true)"
                v-on:focusout="toggleLable('email', false, true)"
                v-on:input="canSubmitEmail" v-on:submit="submitRegister" required/>
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
        <button class="back-button" v-on:click="backToInitial">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M561 816 320 575l241-241 43 43-198 198 198 198-43 43Z"/></svg>
        </button>
        <div class="profile-example">
          <h1 class="creds">Create account</h1>
          <img src="" alt="" class="profile-image">
          <h3 ref="accountDisplayLabel" class="display-name">{{ displayName }}</h3>
        </div>
        <form ref="formOnboardCreds" v-on:submit="submitOnboardCreds">
          <div class="input-field">
            <label class="animated-label display focus" ref="displayNameLabel" for="displayName">Display Name</label>
            <input id="displayName" class="display-name" v-model="displayNameInput" ref="displayNameInputRef"
              v-on:focus="toggleLable('displayName', true, true)"
              v-on:focusout="toggleLable('displayName', false, true), queryCheckDisplayName()" 
              v-on:input="canSubmitCreds(), checkDisplayName()"
              required/>
          </div>
          <p v-if="showErrorCreds" class="error creds">{{ errorMessageCreds }}</p> 
          <div class="input-field">
            <label class="animated-label password-creds" ref="passwordLabelCreds" for="passwordInputCreds">Password</label>
            <input id="passwordInputCreds" class="password" ref="passWordInputCredsRef" v-model="passwordInputCredsModel" type="password"
              v-on:focus="toggleLable('passwordCreds', true, true)"
              v-on:focusout="toggleLable('passwordCreds', false, true), checkPasswordMatch()"
              v-on:input="canSubmitCreds(), checkPasswordMatch()"
              required/>
          </div>
          <div class="input-field">
            <label class="animated-label password-check-creds" ref="passwordLabelCheckCreds" for="passwordInputCheckCreds">Confirm Password</label>
            <input id="passwordInputCheckCreds" class="password-check" v-model="passwordInputCheckCredsModel" ref="passwordInputCheckCredsRef" type="password"
              v-on:focus="toggleLable('passwordCheckCreds', true, true)"
              v-on:focusout="toggleLable('passwordCheckCreds', false, true), checkPasswordMatch()"
              v-on:input="canSubmitCreds(), checkPasswordMatch()"
              required/>
          </div>
          <button ref="credsSubmit" class="creds-onboard-submit disabled" alt="Create your account" title="Create your account">Create account</button>
        </form>
      </div>
    </Transition>
  </section>
</template>

<script lang="ts" setup>
import generateUsername from '@/utils/generateUsername';
const { signIn, data } = useSession();

const route = useRoute();
const router = useRouter();

const registerPanel: Ref = ref(null);
const form = ref(null);
const emailSubmit: Ref = ref(null);
const credsSubmit: Ref = ref(null);

const showErrorInitial: Ref = ref(false);
const showErrorCreds: Ref = ref(false);
const errorMessageInitial: Ref = ref('');
const errorMessageCreds: Ref = ref('');

const emailLabel: Ref = ref(null);
const emailInput: Ref = ref(null);

const passwordLabelCreds: Ref = ref(null);
const passwordInputCredsModel: Ref = ref(null);
const passWordInputCredsRef: Ref = ref(null);

const passwordLabelCheckCreds: Ref = ref(null);
const passwordInputCheckCredsModel: Ref = ref(null);
const passwordInputCheckCredsRef: Ref = ref(null);

const displayName: Ref = ref(generateUsername());
const displayNameInput: Ref = ref(null);
const displayNameInputRef: Ref = ref(null);
  displayNameInput.value = displayName.value;

const accountDisplayLabel: Ref = ref(null);
const displayNameLabel: Ref = ref(null);

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

//Input label toggling
let isEmailFocused = false;
let isDisplayNameFocused = false;
let isPasswordCredsFocused = false;
let isPasswordCheckCredsFocused = false;

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
    case 'displayName':
      currentLabel = displayNameLabel;
      currentInput = displayNameInput;

      if (isFocused) {
        isDisplayNameFocused = !isDisplayNameFocused;
      }

      toggle(isDisplayNameFocused);
      break;
    case 'passwordCreds':
      currentLabel = passwordLabelCreds;
      currentInput = passwordInputCredsModel;

      if (isFocused) {
        isPasswordCredsFocused = !isPasswordCredsFocused;
      }

      toggle(isPasswordCredsFocused);
      break;
    case 'passwordCheckCreds':
      currentLabel = passwordLabelCheckCreds;
      currentInput = passwordInputCheckCredsModel;

      if (isFocused) {
        isPasswordCheckCredsFocused = !isPasswordCheckCredsFocused;
      }

      toggle(isPasswordCheckCredsFocused);
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

const spacesRegex = /\s/g;
const spacesOnlyRegex = /^\s+$/;
function updateDisplayName() {
  displayNameInput.value = displayNameInput.value.replace(spacesRegex, '');
  displayName.value = displayNameInput.value;
}

function checkDisplayName(): boolean {
  updateDisplayName();

  if (displayNameInput.value === null || displayNameInput.value === '' || spacesOnlyRegex.test(displayNameInput.value)) {
    displayName.value = "Your display name"
    showErrorCreds.value = true;
    errorMessageCreds.value = 'Display name cannot be empty';

    displayNameInputRef.value.classList.remove('valid');
    displayNameInputRef.value.classList.add('invalid');
    return false;
  }
  else if (displayNameInput.value.length > 25) {
    showErrorCreds.value = true;
    errorMessageCreds.value = "Name can't be longer than 25 characters";

    displayNameInputRef.value.classList.remove('valid');
    displayNameInputRef.value.classList.add('invalid');
    return false;
  }

  showErrorCreds.value = false;
  errorMessageCreds.value = '';

  displayNameInputRef.value.classList.remove('invalid');
  displayNameInputRef.value.classList.add('valid');
  return true;
}

async function queryCheckDisplayName() {
  if (await queryDatabaseDisplay(displayNameInput.value)) {
    showErrorCreds.value = true;
    errorMessageCreds.value = 'Display name already taken';

    displayNameInputRef.value.classList.remove('valid');
    displayNameInputRef.value.classList.add('invalid');
  }
}

function checkPasswordMatch() {
  if (passwordInputCheckCredsModel.value === null || passwordInputCheckCredsModel.value === '') {
    passWordInputCredsRef.value.classList.remove('valid');
    passWordInputCredsRef.value.classList.remove('invalid');

    passwordInputCheckCredsRef.value.classList.remove('valid');
    passwordInputCheckCredsRef.value.classList.remove('invalid');
    resetCredsErrorMessage();
    return;
  }

  if (runPasswordChecks() && passwordInputCheckCredsModel.value === passwordInputCredsModel.value) {
    passWordInputCredsRef.value.classList.add('valid');
    passWordInputCredsRef.value.classList.remove('invalid');

    passwordInputCheckCredsRef.value.classList.add('valid');
    passwordInputCheckCredsRef.value.classList.remove('invalid');

    resetCredsErrorMessage();
  }
  else {
    passWordInputCredsRef.value.classList.add('invalid');
    passWordInputCredsRef.value.classList.remove('valid');
    
    passwordInputCheckCredsRef.value.classList.add('invalid');
    passwordInputCheckCredsRef.value.classList.remove('valid');
  }
}

async function submitRegister(e: Event) {
  e.preventDefault();
  
  if (emailSubmit.value.classList.contains('disabled')) return;

  checkDisplayName();
  backToCreds();

  if (await queryDatabaseEmail(emailInput.value)) {
    backToInitial();

    showErrorInitial.value = true;
    errorMessageInitial.value = 'That email is already in use';
  }
}


async function submitOnboardCreds(e: Event) {
  e.preventDefault();

  if (credsSubmit.value.classList.contains('disabled')) return;

  if (!runPasswordChecks()) {
    return;
  }

  if (await queryDatabaseDisplay(displayNameInput.value)) {
    showErrorCreds.value = true;
    errorMessageCreds.value = 'That display name is already in use';
    return;
  }

  const email = emailInput.value;
  const password = passwordInputCredsModel.value;
  const displayName = displayNameInput.value;
  const auth_provider = 'email';

  //send to database
  const response = await useFetch('/api/auth/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password,
      display_name: displayName,
      auth_provider: auth_provider
    })
  });

  if (response.data.value?.statusCode == 200) {
    window.location.href = '/';
  }
  else {
    showErrorCreds.value = true;
    errorMessageCreds.value = response.data.value?.body;
  }
}

const cascadingNumbersRegex = /\d{5}/;
const repeatingCharacter = /(.)\1{7}/;
function runPasswordChecks(showErrors: boolean = true) {
  if (passwordInputCheckCredsModel.value === null || passwordInputCheckCredsModel.value === '') {
    if (!showErrors) return false;
    errorMessageCreds.value = 'Please enter a password';
    showErrorCreds.value = true;
    return false;
  }

  if (passwordInputCheckCredsModel.value.length < 8) {
    if (!showErrors) return false;
    errorMessageCreds.value = 'Password must be at least 8 characters';
    showErrorCreds.value = true;
    return false;
  }

  if (passwordInputCheckCredsModel.value.length > 128) {
    if (!showErrors) return false;
    errorMessageCreds.value = 'Password must be less than 128 characters';
    showErrorCreds.value = true;
    return false;
  }

  if (passwordInputCredsModel.value !== passwordInputCheckCredsModel.value) {
    if (!showErrors) return false;
    errorMessageCreds.value = 'Passwords do not match';
    showErrorCreds.value = true;
    return false;
  }

  if (cascadingNumbersRegex.test(passwordInputCheckCredsModel.value)) {
    if (!showErrors) return false;
    errorMessageCreds.value = "Cascading numbers aren't very secure!";
    showErrorCreds.value = true;
    return false;
  }

  if (repeatingCharacter.test(passwordInputCheckCredsModel.value)) {
    if (!showErrors) return false;
    errorMessageCreds.value = "Repeating characters aren't very secure!";
    showErrorCreds.value = true;
    return false;
  }

  if (passwordInputCredsModel.value === 'password' || passwordInputCredsModel.value === 'Password' || passwordInputCredsModel.value === 'PASSWORD') {
    if (!showErrors) return false;
    errorMessageCreds.value = "Please choose a more secure password!";
    showErrorCreds.value = true;
    return false;
  }

  return true;
}

function resetCredsErrorMessage() {
  errorMessageCreds.value = '';
  showErrorCreds.value = false;
}

function canSubmitEmail() {
  const emailRegex = /@/;
  
  if (emailRegex.test(emailInput.value) && emailInput.value !== '') {
    emailSubmit.value.classList.remove('disabled');
  }
  else {
    emailSubmit.value.classList.add('disabled');
  }

  if (showErrorInitial.value = true) {
    showErrorInitial.value = false;
    errorMessageInitial.value = '';
  }
}

async function canSubmitCreds(showErrors: boolean = false) {
  if (!runPasswordChecks(showErrors)) {
    credsSubmit.value.classList.add('disabled');
    return;
  }

  if (await queryDatabaseDisplay(displayName.value)) {
    credsSubmit.value.classList.add('disabled');
    return;
  }

  if (!checkDisplayName()) {
    credsSubmit.value.classList.add('disabled');
    return;
  }

  credsSubmit.value.classList.remove('disabled');
   
  if (showErrorCreds.value = true) {
    showErrorCreds.value = false;
    errorMessageCreds.value = '';
  }
}

async function queryDatabaseEmail(email: string): Promise<boolean> {
  const response = await useFetch(`/api/auth/check-user?email=${email}`);
  const data: any = await response.data.value;

  if (data.body.userExists) {
    return true
  }

  return false;
}

async function queryDatabaseDisplay(name: string): Promise<boolean> {
  const response = await useFetch(`/api/auth/check-display?name=${name}`);
  const data: any = await response.data.value;

  if (data.body.nameExists) {
    return true
  }

  return false;
}

function backToInitial() {
  initialPanel.value = true;
  onboardOAuth.value = false;
  disableCredsPanel();
}

function backToOAuth() {
  onboardOAuth.value = true;
  initialPanel.value = false;
  disableCredsPanel();
}

function backToCreds() {
  onboardCredentials.value = true;
  registerPanel.value.classList.add('creds-onboard');

  onboardOAuth.value = false;
  initialPanel.value = false;
}

function disableCredsPanel() {
  onboardCredentials.value = false;
  registerPanel.value.classList.remove('creds-onboard');
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

  //handleCredentialsSignIn({ email, password })
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
  margin-bottom: 3rem;
  align-self: flex-start;

  &.creds {
    margin-bottom: 1rem;
  }
}

p.error {
  align-self: flex-start;
  margin-bottom: 1rem;
  color: red;

  &.creds {
    align-self: center;
    position: absolute;
    bottom: -3rem;
    font-size: 0.8rem;
  }
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
  z-index: 0;
  transition: height 0.1s ease-out;

  &.creds-onboard {
    height: 700px;
  }

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
    height: 100%;

    .input-field {
      width: 100%;
    }

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
      opacity: 0.4;
      transition: transform 0.1s cubic-bezier(0.075, 0.82, 0.165, 1), font-size 0.1s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
      z-index: 1;

      &.email {
        top: -1rem;
        left: 0rem;
      }

      &.display {
        bottom: 17.2rem;
        left: 0rem;

        &.focus {
          transform: translate3d(0.8rem, -0.2rem, 0);
        }
      
      }

      &.password-creds {
        bottom: 11.4rem;

      }

      &.password-check-creds {
        bottom: 6.95rem;
      }

      &.focus {
        transform: translate3d(0.8rem, -0.2rem, 0);
        opacity: 1;
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
      font-size: 1rem;
      z-index: 0;

      &:focus {
        outline: none;
        border: 1px solid var(--input-focus-color);
      }

      &.display-name {
        margin-bottom: 3rem;
      }

      &.valid {
        transition: border 0.35s ease-out;
        border: 1px solid var(--input-valid-color);
      }

      &.invalid {
        transition: border 0.35s ease-out;
        border: 1px solid var(--input-invalid-color);
      }
    }

    .email-signup, .creds-onboard-submit {
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
  justify-content: space-between;

  .back-button {
    position: absolute;
    top: -2.7rem;
    left: -1.5rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.15s ease-in-out;

    &:hover {
      color: var(--text-color);
    }

    svg {
      filter: invert(1);
      width: 2rem;
      height: 2rem;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .profile-example {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin-top: 1rem;

    .display-name {
      text-align: center;
      font-size: 1.1rem;
      margin-top: 1rem;
      margin-bottom: 3.5rem;

      &.empty {
        opacity: 0.4;
      }
    }

    h1 {
      align-self: center;
    }

    img {
      align-self: center;
      height: 9rem;
      width: 9rem;
      margin-top: 1rem;
      border-radius: 100%;
      background-color: rgb(187, 187, 187);
    }
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