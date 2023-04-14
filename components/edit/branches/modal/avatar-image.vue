<template>
  <section class="modal" ref="modal">
    <div class="panel">
      <div class="info">
        <h3>Avatar image</h3>
        <button class="close-button" @click="shouldClose()">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
        </button>
      </div>
      <div class="content">
        <div class="image">
          <img :src="branchData.branch.icon_image" />
        </div>
        <div class="actions">
          <button class="button">Change Image</button>
          <button class="button">Remove Image</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps(['branchData']);

const modal: Ref = ref(null);

onMounted(() => {
  modal.value.classList.add('active');
});

function shouldClose() {
  avatarImageModalEnabled().value = false;
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  &.active {
    background-color: rgba(0, 0, 0, 0.7);

    .panel {
      opacity: 1;
    }
  }
}

.panel {
  position: relative;
  background-color: var(--panel-color);
  border-radius: 0.5rem;
  padding: 2rem;
  width: 700px;
  height: 400px;
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  .close-button {
    background-color: transparent;
    position: relative;

    svg {
      width: 2rem;
      height: 2rem;
      fill: var(--text-color);
    }
  }

  .info {
    display: grid;
    grid-template-columns: 1fr 2rem;

    h3 {
      font-size: 1.5rem;
      font-weight: 500;
      color: var(--text-color);
    }
  }
}


.content {
  img {
    width: 6rem;
    height: 3rem;
  }
}
</style>