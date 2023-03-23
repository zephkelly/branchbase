<template>
  <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </Head>
  <header>
    <div class="logo">
      <img src="~/assets/logo.png" alt="Logo" />
    </div>
    <nav>
      <ul>
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/explore">Explore</nuxt-link>
        </li>
      </ul>
      <nuxt-link to="/login">Login</nuxt-link>
    </nav>
  </header>
</template>

<script lang="ts">
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
    border-bottom: 1px solid rgb(54, 54, 54);
  }

  .logo {
    width: 70px;
    height: 100%;
    overflow: hidden;

    img {
      width: 140%;
      height: 140%;
      object-fit: cover;
      margin-top: -0.5rem;
      margin-left: -0.9rem;
    }
  }

  nav {
    display: flex;
    width: calc(100% - 70px);
    align-items: center;
    justify-content: space-between;
    margin-left: 6rem;

    ul {
      display: flex;
      flex-direction: row;
      height: 100%;
      gap: 2rem;

      li {
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        color: white;
        height: 100%;
        width: 4.5rem;

        a {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
      }
    }
  }
</style>