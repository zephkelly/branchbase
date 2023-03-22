<template>
  <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </Head>
  <section class="landing">
    <h1>Hello</h1>
  </section>
</template>

<style lang="scss" scoped>
  .landing {
    height: 100vh;
    min-height: 800px;
    margin-top: 10rem;

    h1 {
      font-family: 'Roboto', sans-serif;
      font-weight: 700;
      color: white;
    }
  }
</style>

<script lang="ts" setup>
  useHead({
    title: 'Home',
    meta: [
      {
        name: 'description',
        content: 'This is the home page',
      },
    ],
  });
</script>