<template>
  <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </Head>
  <section class="landing">
  </section>
</template>

<script lang="ts" setup>
useHead({
  title: 'Home',
  meta: [{
      name: 'description',
      content: 'This is the home page',
    },],
});

const { status, getProviders, signOut, data } = useSession();

console.log(status.value, getProviders())
</script>

<style lang="scss" scoped>
  .landing {
    height: calc(100% - 3rem);
  }
</style>