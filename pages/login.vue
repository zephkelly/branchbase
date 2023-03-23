<template>
  <section>
    <p>Sign-In Options:</p>
    <button @click="signIn('github')">Github</button>
    <button @click="signIn('credentials', { username: 'test', password: 'hunter2' })">Username and Password</button>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  auth: false,
  layout: 'center-align',
})

const { signIn } = useSession()
</script>

<style lang="scss" scoped>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
  }
</style>
