<template>
  <navbar />
  <main>
    <slot />
  </main>
</template>

<style lang="scss" scoped>
  main {
    width: 100%;
    height: 100vh;
  }
</style>

<script>
import '~/assets/scss/main.scss';
</script>