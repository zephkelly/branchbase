<template>
  <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </Head>
  <header>
    <nuxt-link class="logo" to="/" v-on:click="toggleSideNav()">
      <img src="~/assets/logo.png" alt="Logo" />
    </nuxt-link>

    <button ref="currentFeedButton" class="current-feed" v-on:click="toggleSideNav()" title="Explore your feeds and communities.">
      <p>{{ toggleFeedMenuText }}</p>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960"><path d="M480 711 240 471l43-43 197 198 197-197 43 43-240 239Z"/></svg>
    </button>
  
    <div v-if="!isSignupLogin" class="log-buttons">
      <nuxt-link v-if="!shouldLogout" ref="loginButton" to="/login">Login</nuxt-link>
      <button v-else class="shouldLogout-button" v-on:click="logOut()">Logout</button>
    </div>
  </header>
  <aside ref="sideNav" class="side-nav minimise">
    <div class="lists">
      <explore-feeds />
      <explore-branches />
    </div>
  </aside>
</template>

<script lang="ts" setup>
const { data, signOut } = useSession();
const route = useRoute();

const isExplore = computed(() => {
  return route.path === '/explore';
});

const shouldLogout: Ref = ref(false);
(async () => {
  if (data.value?.user) {
    shouldLogout.value = true;
  }
})()

const loginButton: Ref = ref(null);
const isSignupLogin = computed(() => {
  return (
    route.path === '/login' ||
    route.path === '/signup' ||
    route.path === '/forgot-password'
  );
});

const sideNav: Ref = ref(null);
function toggleSideNav() {
  toggleFeedButtonActive();

  if (toggleFeed.value) {
    sideNav.value?.classList.remove('minimise');
  } else {
    sideNav.value?.classList.add('minimise');
  }
}
  
const toggleFeed: Ref = toggleFeedMenu();
const currentFeedButton: Ref = ref(null);
const toggleFeedMenuText: Ref = toggleFeedMenuString();
function toggleFeedButtonActive() {
  if (toggleFeed.value) {
    currentFeedButton.value.classList.remove('active');
  } else {
    currentFeedButton.value.classList.add('active');
  }
  
  toggleFeed.value = !toggleFeed.value;
}

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

  button.current-feed {
    position: relative;
    width: 7.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 2rem;
    border-radius: 0.4rem;
    background-color: transparent;
    border: 1px solid var(--panel-border-color);
    transition: background-color 0.2s ease-in-out;
    padding: 0rem;
    cursor: pointer;

    * {
      width: 100%;
      box-sizing: border-box;
      color: var(--text-color);
    }

    p {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 1rem;
      padding: 0rem 0.8rem;
      height: 0.9rem;
    }

    svg {
      position: absolute;
      top: 0.4rem;
      right: 0.5rem;
      width: 1.4rem;
      height: 1.4rem;
      fill: var(--text-color);
      transition: transform 0.2s ease-in-out;
      transform: rotate(180deg) translate(0rem, 0rem);

    }

    &.active {
      background-color: var(--panel-hover-color-light);
      border: 1px solid var(--panel-border-color);
      
      svg {
        transform: rotate(0deg) translate(0rem, 0rem);  
      }
    }
  }

  .side-nav {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;
    height: calc(100vh - 3rem);
    width: 240px;
    background-color: var(--panel-color);
    border-right: 1px solid rgb(54, 54, 54);
    margin-top: 3rem;
    transition: transform 0.3s ease-in-out;

    .lists {
      overflow: hidden;
      overflow-y: auto;
      padding-bottom: 4rem;
      padding-top: 2.5rem;
    }
  }

  .side-nav.minimise {
    transform: translate3d(-100%, 0, 0);

    img {
      transform: rotate(180deg);
    }
  }

  .shouldLogout-button {
    background-color: transparent;
    border: none;
    font-size: 1rem;
    cursor: pointer;
  }
</style>