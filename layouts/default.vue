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
  }
</style>

<script>
import '~/assets/scss/main.scss';
</script>