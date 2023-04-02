<template>
  <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </Head>
  <header>
    <nuxt-link class="logo" to="/" v-on:click="toggleFeedMenu().value = false">
      <img src="~/assets/logo.png" alt="Logo" />
    </nuxt-link>

    <NavigationSideNavButton />
  
    <div v-if="!isSignupLogin" class="log-buttons">
      <nuxt-link v-if="!shouldLogout" ref="loginButton" to="/login">Login</nuxt-link>
      <button v-else class="shouldLogout-button" v-on:click="logOut()">Logout</button>
    </div>
  </header>
  <NavigationBrowseNav />
</template>

<script lang="ts" setup>
//Session data
const { data, signOut } = useSession();

const shouldLogout = computed(() => {
  return data.value?.user;
})

//Route checkers
const route = useRoute();

const isExplore = computed(() => {
  return route.path === '/explore';
});

const isSignupLogin = computed(() => {
  return (
    route.path === '/login' ||
    route.path === '/signup' ||
    route.path === '/forgot-password'
  );
});

function logOut() {
  signOut({ callbackUrl: '/login' })
}
</script>

<style lang="scss" scoped>
  header {
    position: fixed;
    display: flex;
    width: 100%;
    height: 3rem;
    flex-direction: row;
    box-sizing: border-box;
    padding: 0.4rem 1.5rem;
    background-color: var(--panel-color);
    border-bottom: 1px solid var(--panel-border-color);
    z-index: 100;
  }

  .logo {
    width: 70px;
    min-width: 70px;
    height: 100%;
    margin-right: 1.6rem;
    overflow: hidden;

    img {
      opacity: 0.8;
      width: 140%;
      height: 140%;
      object-fit: cover;
      margin-top: -0.5rem;
      margin-left: -0.9rem;
    }
  }
</style>