<template>
  <NavigationNavbar />
  <main>
    <slot />
  </main>
</template>

<style lang="scss" scoped>
  main {
    width: 100%;
    min-height: 100vh;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  .post {
    .post-info {
      .branch-name {
        color: red;
      }
    }
  }
</style>

<script>

import '~/assets/scss/main.scss';
</script>