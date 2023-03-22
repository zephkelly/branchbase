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
          <nuxt-link to="/about">About</nuxt-link>
        </li>
      </ul>
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
    height: 3.5rem;
    flex-direction: row;
    box-sizing: border-box;
    padding: 0.4rem 2rem;
    background-color: rgb(14, 15, 16);
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
    align-items: center;
    justify-content: flex-end;
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