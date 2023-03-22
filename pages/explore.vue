<template>
  <aside class="side-nav">
    <explore-feeds />
    <explore-branches />
  </aside>
</template>

<script lang="ts">

</script>

<style lang="scss">
  main {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .side-nav {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;
    height: calc(100% - 3rem);
    width: 230px;
    background-color: var(--panel-color);
    border-right: 1px solid rgb(54, 54, 54);
    margin-top: 3rem;
    transition: transform 0.3s ease-in-out;
    overflow: hidden;
    overflow-y: auto;
    padding-bottom: 4rem;

    h6.title {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      font-size: 1.6rem;
      width: calc(100% - 3rem);
      color: var(--text-color);
      padding: 1.5rem;
      padding-top: 2rem;
      padding-bottom: 0.4rem;
    }

    p.subtitle {
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      width: calc(100% - 3rem);
      color: var(--text-color);
      padding: 1.5rem;
      padding-top: 0rem;
      padding-bottom: 0rem;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    p.label {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      font-size: 0.8rem;
      width: calc(100% - 3rem);
      color: var(--text-color);
      padding: 1.5rem;
      padding-top: 0rem;
      padding-bottom: 0.4rem;
      opacity: 0.3;
    }
  }

  .side-nav.minimise {
    transform: translate3d(-100%, 0, 0);
  }
</style>