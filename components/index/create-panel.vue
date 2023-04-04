<template>
  <Transition name="fade">
    <div v-show="isCreating().value" class="create-panel">
      
    </div>
  </Transition>
</template>

<script lang="ts" setup>
  
</script>

<style lang="scss" scoped>
.create-panel {
  position: absolute;
  top: 7.1rem;
  width: 100%;
  height: 20rem;
  border: 1px solid var(--panel-border-color);
  border-radius: 0.4rem;
  background-color: var(--panel-color);
  opacity: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>