<template>
  <aside class="side-nav">
    <section class="feeds">
      
    </section>
    <explore-branch-list />
  </aside>
</template>

<script lang="ts">

</script>

<style lang="scss" scoped>
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
    width: 220px;
    background-color: var(--panel-color);
    border-right: 1px solid rgb(54, 54, 54);
    margin-top: 3rem;
    transition: transform 0.3s ease-in-out;
  }

  .side-nav.minimise {
    transform: translate3d(-100%, 0, 0);
  }
</style>