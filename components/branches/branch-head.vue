<template> 
  <header class="branch-header pending" v-if="isPending">
    <div class="background-image">
      <div class="fade"></div>
    </div>
    <div class="title">
      <div class="icon">
      </div>
      <div class="text">
        <h1 class="branch-title pending-large"><title></title></h1>
        <p class="pending"></p>
      </div>
    </div>
  </header>
  <header class="branch-header" v-else>
    <div class="background-image">
      <img :src="props.branchData.branchMeta.background_image" >
      <!-- <div class="fade"></div> -->
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
const props = defineProps(['branchData', 'isPending']);
const branchHeader = ref(null);
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
  width: 100%;
  margin-top: 3rem;
  background-color: var(--panel-color);
  border-bottom: 1px solid var(--panel-border-color);

  * {
    box-sizing: border-box;  
  }
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
    font-family: 'Roboto', 'Inter', sans-serif;

    h1 {
      font-size: 2rem;
      font-weight: 700;
    }

    p {
      margin-top: 0.5em;
      font-size: 1rem;
      color: var(--text-color-darker);
      opacity: 0.6;
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
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2rem;
    pointer-events: none;
    opacity: 0.4;
    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, var(--panel-color) 100%);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background-color: rgb(61, 61, 61);
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

<style lang="scss" scoped>
  .background-image {
    background-color: rgb(38, 38, 38);
  }

  .title {
    .icon {
      background-color: var(--panel-color);
      border: 1px solid var(--panel-border-color);
    }

    .text {
      h1 {
        height: 2rem;
        width: 16rem;
        animation: pulse 2.2s ease-in-out infinite alternate;
        animation-delay: 0.5s;
      }

      p {
        height: 1rem;
        width: 8rem;
        animation: pulse 1.5s ease-in-out infinite alternate;
      }
    }
  }
</style>