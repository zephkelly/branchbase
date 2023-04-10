<template>
  <nav class="control-bar">
    <div class="bar-content">
    </div>
    <div>
      <button class="create" @click="toggleCreatePanel()" ref="createButton" alt="Toggle the create panel" title="Toggle the create panel">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z"/></svg>
      </button>
    </div>
  </nav>
</template>

<script lang="ts" setup>
const props = defineProps(['currentPage']);
const createButton: Ref = ref(null);

watch(isCreatingIndex(), (val) => {
  if (val === true) {
    createButton.value.classList.add('active');
  } else {
    createButton.value.classList.remove('active');
  }
});

watch(isCreatingBranch(), (val) => {
  if (val === true) {
    createButton.value.classList.add('active');
  } else {
    createButton.value.classList.remove('active');
  }
});

function toggleCreatePanel() {
  if (props.currentPage === 'index') {
    isCreatingIndex().value = !isCreatingIndex().value;
  } else if (props.currentPage === 'branch') {
    isCreatingBranch().value = !isCreatingBranch().value;
  }
}
</script>

<style lang="scss" scoped>
.control-bar {
  display: grid;
  grid-template-columns: 1fr 3.5rem;
  width: 100%;
  height: 3.5rem;
  margin: 2rem 0rem;
  margin-bottom: 1rem;
  background-color: var(--panel-color);
  border: 1px solid var(--panel-border-color);
  border-radius: 0.4rem;
  
  div {
    display: flex;
    max-height: 3.5rem;
    justify-content: flex-start;

    &:last-child {
      justify-content: flex-end;
    }
  }
}

.bar-content {
  padding: 1rem;

  h3 {
    align-self: center;
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    color: var(--text-color);
  }
}

button.create {
  align-self: flex-end;
  height: 100%;
  width: 3.5rem;
  padding: 0rem;
  border: none;
  border-radius: 0rem 0.4rem 0.4rem 0rem;
  cursor: pointer;
  background-color: var(--panel-color);
  transition: background-color 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);

  svg {
    height: 50%;
    width: 50%;
    fill: var(--text-color);
  }

  &:hover {
    background-color: var(--panel-hover-color);
  }

  &.active {
    background-color: var(--panel-hover-color);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>