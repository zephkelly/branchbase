<template>
  <aside ref="sideNav" class="side-nav">
    <button ref="closeButton" class="close-button add-border" @click="toggleSideNav">
      <img src="@/assets/images/svg/chevron_left.svg" alt="close" />
    </button>
    <div class="lists">
      <explore-feeds />
      <explore-branches />
    </div>
  </aside>
</template>

<script lang="ts">
const sideNav = ref(null);
const closeButton = ref(null);
//toggle side nav class to open or close

export default {
  setup() {
    return {
      sideNav,
      closeButton,
      toggleSideNav
    }
  }
}

function toggleSideNav() {
  console.log('toggle');
  sideNav.value?.classList.toggle('minimise');

  setTimeout(() => {
    closeButton.value?.classList.toggle('add-border');
  }, 300);
}
</script>

<style lang="scss">
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
      height: 3rem;
      min-height: 3rem;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background-color: transparent;
      border: none;
      transition: transform 0.3s ease-in-out, border-bottom 0.3s ease-in-out, padding-left 0.3s ease-in-out, width 0.3s ease-in-out;
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
        transition: transform 0.3s ease-in-out;
      }

      &:hover {
        background-color: rgb(54, 54, 54);
        opacity: 1;
      }
    }

    .close-button.add-border {
      border-bottom: 1px solid rgb(54, 54, 54);
    }

    .lists {
      overflow: hidden;
      overflow-y: auto;
      padding-bottom: 4rem;
    }
  }

  .side-nav.minimise {
    transform: translate3d(-100%, 0, 0);

    .close-button {
      width: 3rem;
      padding-left: 0.6rem;
      transform: translate3d(220px, 0, 0);
      border-bottom: none;
      border-radius: 0rem 0.5rem 0.5rem 0rem;

      img {
        transform: rotate(180deg);
      }
    }
  }
</style>