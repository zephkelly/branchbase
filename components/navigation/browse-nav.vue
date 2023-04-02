<template>
  <aside ref="sideNav" class="side-nav minimise">
    <div class="lists">
      <NavigationBrowseNavFeeds />
      <NavigationBrowserNavBranches/>
    </div>
  </aside>
</template>

<script lang="ts" setup>
//Toggle side nav minimised
const sideNav: Ref = ref(null);
watch(toggleFeedMenu(), (value) => {
  if (value) {
    sideNav.value?.classList.remove('minimise');
  } else {
    sideNav.value?.classList.add('minimise');
  }
});
</script>

<style lang="scss" scoped>
aside {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  height: calc(100vh - 3rem);
  width: 240px;
  background-color: var(--panel-color);
  border-right: 1px solid rgb(54, 54, 54);
  margin-top: 3rem;
  transition: transform 0.3s ease-in-out;
  z-index: 100;

  .lists {
    overflow: hidden;
    overflow-y: auto;
    padding-bottom: 4rem;
    padding-top: 2.5rem;
  }
}

.side-nav.minimise {
  transform: translate3d(-100%, 0, 0);

  img {
    transform: rotate(180deg);
  }
}
</style>
