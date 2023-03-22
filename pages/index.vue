<template>
  <Head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </Head>
  <section class="landing">
    <section class="branches">
      <h1>Explore Branches</h1>
        <div v-if="pending">
          Loading ...
        </div>
        <ul v-else>
          <li v-for="branch in branches?.body">
            b/{{ branch.name }}
          </li>
        </ul>
    </section>
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

const { pending, data: branches } = useLazyFetch('/api/branches');
</script>

<style lang="scss" scoped>
  .landing {
    height: 100vh;
    min-height: 800px;
    margin-top: 10rem;
  }

  .branches {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    min-height: 380px;
    width: 200px;
    padding: 1rem;
    background-color: rgb(14, 15, 16);
    border-radius: 0.5rem;
    border: 1px solid rgb(54, 54, 54);

    h1 {
      font-family: 'Roboto', sans-serif;
      font-weight: 700;
      font-size: 1.6rem;
      width: 100%;
      color: white;
      padding-bottom: 0.8rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid rgb(54, 54, 54);
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      gap: 0.8rem;
      color: white;

      li {
        width: 100%;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &:hover {
          cursor: pointer;
          background-color: rgb(54, 54, 54);
        }
      }
    }
  }
</style>