<template>
  <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </Head>
  <section class="landing">
    <p v-if="status === 'authenticated'" style="margin-top: 10rem;">Welcome {{ data?.user?.name }}</p>
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

const { status, signOut, data } = useSession();
const showMessage = ref(false);
</script>

<style lang="scss" scoped>
  .landing {
    height: calc(100% - 3rem);
  }
</style>