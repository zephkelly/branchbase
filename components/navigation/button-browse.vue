<template>
  <button ref="currentFeedButton" class="current-feed" v-on:click="toggleFeedMenu().value = !toggleFeedMenu().value" title="Explore your feeds and communities.">
    <p>{{ toggleFeedMenuString().value }}</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
      <path d="M480 711 240 471l43-43 197 198 197-197 43 43-240 239Z"/>
    </svg>
  </button>
</template>

<script lang="ts" setup>
const currentFeedButton: Ref = ref(null);
watch(toggleFeedMenu(), (value) => {
  if (value) {
    currentFeedButton.value?.classList.add('active');
  } else {
    currentFeedButton.value?.classList.remove('active');
  }
});

onUnmounted(() => {
  toggleFeedMenu().value = false;
})
</script>

<style lang="scss" scoped>
button {
  position: relative;
  min-width: 6.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 2rem;
  border-radius: 0.4rem;
  background-color: transparent;
  border: 1px solid var(--panel-border-color);
  transition: background-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1), borderColor 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
  padding: 0rem;
  cursor: pointer;

  * {
    width: 100%;
    box-sizing: border-box;
    color: var(--text-color);
  }

  p {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1rem;
    padding: 0rem 0.8rem;
    height: 0.9rem;
  }

  svg {
    position: absolute;
    top: 0.4rem;
    right: 0.5rem;
    width: 1.4rem;
    height: 1.4rem;
    fill: var(--text-color);
    transition: transform 0.2s ease-in-out;
    transform: rotate(90deg) translate(0rem, 0rem);
  }

  &.active {
    background-color: var(--panel-hover-color);
    border: 1px solid var(--panel-border-color);
    
    svg {
      transform: rotate(270deg) translate(0rem, 0rem);  
    }
  }

  &:hover {
    border: 1px solid var(--panel-border-hover-color);
  }
}
</style>