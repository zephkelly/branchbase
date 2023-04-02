<template>
  <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </Head>
  <authenticated v-if="status === 'authenticated'" />
  <unauthenticated v-else />
</template>

<script lang="ts" setup>
import authenticated from '~~/components/index/authenticated.vue';
import unauthenticated from '~~/components/index/unauthenticated.vue';

useHead({
  title: 'Home',
  meta: [{
    name: 'description',
    content: 'This is the home page',
  },],
});

const { status, signOut, data } = useSession();
const showMessage: Ref = ref(false);
const message: Ref = ref('');

definePageMeta({
  auth: false,
  layout: 'center-align',
}) 
</script>

<style lang="scss" scoped>
</style>