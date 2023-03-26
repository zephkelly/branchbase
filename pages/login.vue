<template>
  <section v-if="!isLoggedIn">
    <p>Sign-In Options:</p>
    <button @click="handleSignIn">Github</button>
    <p>Enter email:</p>
  </section>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const isLoggedIn = ref(false);
const { signIn, getSession } = useSession()

async function handleSignIn() {
  await signIn('github', { callbackUrl: `/login?loggedIn=true&provider=github` });
}

if (route.query.loggedIn === 'true') {
  const session = await getSession();
  const hasSession = session?.user ? true : false;

  if (!hasSession) {
    isLoggedIn.value = false;
  } else {
    isLoggedIn.value = true;
    //@ts-expect-error
    await queryDatabase(session.user.email);
  }
}

async function queryDatabase(email: string) {
  const response = await useFetch(`/api/auth/check-user?email=${email}`);
  const data = await response.data.value;

  //@ts-expect-error
  if (data.body.userExists) {
    router.push('/?loggedIn=true');
  } else {
    router.push(`/register?authSignup=true&provider=${route.query.provider}`);
  }
}

definePageMeta({
  auth: false,
  layout: 'center-align',
})
</script>

<style lang="scss" scoped>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
  }
</style>
