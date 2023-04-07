<template> 
  <header class="branch-header">
    <div class="background-image">
      <img :src="props.branchData.branchMeta.background_image" >
      <div class="fade"></div>
    </div>
    <div class="title">
      <div class="icon">
        <img :src="props.branchData.branch.icon_image">
      </div>
      <div class="text">
        <h1>{{ props.branchData.branchMeta.branch_title }}</h1>
        <p>b/{{ props.branchData.branch.branch_name }}</p>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
const props = defineProps(['branchData'])

console.log(props.branchData)
</script>

<style lang="scss" scoped>
header.branch-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  height: 12rem;
  margin-top: 3rem;
  background-color: var(--panel-color);
  border-bottom: 1px solid var(--panel-border-color);

  * {
    box-sizing: border-box;  
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 700px;
    height: 6rem;

    .icon {
      position: relative;
      top: -2.5rem;
      min-width: 7rem;
      min-height: 7rem;
      max-width: 7rem;
      max-height: 7rem;
      margin-right: 1rem;
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--panel-color);
      border: 1px solid var(--panel-border-color);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }

    .text {
      width: 100%;
      justify-content: flex-end;
      padding: 1rem 0rem;
      font-family: 'Roboto', sans-serif;

      h1 {
        font-size: 2rem;
        font-weight: 700;
      }

      p {
        color: var(--text-color-darker);
        opacity: 0.6;
        margin-top: 0.5em;
      }
    }
  }
}

.background-image {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 6rem;
  max-height: 6rem;
  border-bottom: 1px solid var(--panel-border-color);

  .fade {
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3rem;
    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, var(--panel-color) 100%);
    pointer-events: none;
    opacity: 0.6;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade2-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade2-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>