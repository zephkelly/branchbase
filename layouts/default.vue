<template>
  <navbar />
  <main>
    <slot />
  </main>
</template>

<style lang="scss" scoped>
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

<script>
import '~/assets/scss/main.scss';
</script>