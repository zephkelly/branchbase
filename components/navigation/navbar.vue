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
    <NavigationButtonBrowse />
    <div v-if="showLogin" class="log-buttons">
      <nuxt-link v-if="!shouldLogout" ref="loginButton" to="/login">Login</nuxt-link>
      <button v-else class="logout" v-on:click="logOut()">Logout {{ userName }}</button>
    </div>
  </header>
  <NavigationBrowse />
</template>

<script lang="ts" setup>
const route = useRoute();
const { data, signOut } = useAuth();


const userName = computed(() => {
  return regexDisplayName(data);
})

//Login
const showLogin = computed(() => {
  if (route.path === '/login' ||
    route.path == '/register' ||
    route.path == '/forgot-password'
  ) { return false; }

  return true;
});

//Logout
const shouldLogout = computed(() => {
  return data.value?.user;
})

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
    z-index: 80;
    top: 0rem;
    left: 0rem;
    right: 0rem;
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

  .log-buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    button.logout {
      background-color: transparent;
      border: none;
      font-size: 0.8rem;
      cursor: pointer;
      padding: 0;

      &:hover {
        border-bottom: 1px solid var(--text-color);
      }
    }
  }
</style>