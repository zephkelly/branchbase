<template>
  <aside ref="sideNav" class="side-nav">
    <button class="close-button" @click="toggleSideNav">
      <img src="@/assets/images/svg/chevron_left.svg" alt="close" />
    </button>
    <explore-feeds />
    <explore-branches />
  </aside>
</template>

<script lang="ts">
const sideNav = ref(null);
//toggle side nav class to open or close

export default {
  setup() {
    return {
      sideNav,
      toggleSideNav
    }
  }
}

function toggleSideNav() {
  console.log('toggle');
  sideNav.value?.classList.toggle('minimise');
}
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
    width: 220px;
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
      margin-bottom: 1rem;
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

    .close-button {
      width: 100%;
      min-height: 3rem;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background-color: transparent;
      border: none;
      padding: 0rem 1.5rem;
      opacity: 0.8;
      cursor: pointer;

      img {
        filter: invert(1);
        width: 1.8rem;
        height: 1.8rem;
        min-width: 1.8rem;
        min-height: 1.8rem;
        border-radius: 100%;
        background-color: rgba(104, 104, 104, 0.297);
      }

      &:hover {
        background-color: rgb(54, 54, 54);
        opacity: 1;
      }
    }
  }

  .side-nav.minimise {
    transform: translate3d(-100%, 0, 0);
  }
</style>