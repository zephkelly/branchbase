<template>
  <NavigationNavbar />
  <main>
    <slot />
  </main>
</template>

<style lang="scss" scoped>
  main {
    width: 100%;
  }
</style>

<script lang="ts">
import '~/assets/scss/main.scss';
</script>