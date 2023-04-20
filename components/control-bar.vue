<template>
  <nav ref="navbar" class="control-bar">
    <div class="bar-content">
      <div class="drag-handle">
        <svg 
          xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M349.911 896Q321 896 300.5 875.411q-20.5-20.588-20.5-49.5Q280 797 300.589 776.5q20.588-20.5 49.5-20.5Q379 756 399.5 776.589q20.5 20.588 20.5 49.5Q420 855 399.411 875.5q-20.588 20.5-49.5 20.5Zm260 0Q581 896 560.5 875.411q-20.5-20.588-20.5-49.5Q540 797 560.589 776.5q20.588-20.5 49.5-20.5Q639 756 659.5 776.589q20.5 20.588 20.5 49.5Q680 855 659.411 875.5q-20.588 20.5-49.5 20.5Zm-260-250Q321 646 300.5 625.411q-20.5-20.588-20.5-49.5Q280 547 300.589 526.5q20.588-20.5 49.5-20.5Q379 506 399.5 526.589q20.5 20.588 20.5 49.5Q420 605 399.411 625.5q-20.588 20.5-49.5 20.5Zm260 0Q581 646 560.5 625.411q-20.5-20.588-20.5-49.5Q540 547 560.589 526.5q20.588-20.5 49.5-20.5Q639 506 659.5 526.589q20.5 20.588 20.5 49.5Q680 605 659.411 625.5q-20.588 20.5-49.5 20.5Zm-260-250Q321 396 300.5 375.411q-20.5-20.588-20.5-49.5Q280 297 300.589 276.5q20.588-20.5 49.5-20.5Q379 256 399.5 276.589q20.5 20.588 20.5 49.5Q420 355 399.411 375.5q-20.588 20.5-49.5 20.5Zm260 0Q581 396 560.5 375.411q-20.5-20.588-20.5-49.5Q540 297 560.589 276.5q20.588-20.5 49.5-20.5Q639 256 659.5 276.589q20.5 20.588 20.5 49.5Q680 355 659.411 375.5q-20.588 20.5-49.5 20.5Z"/>
        </svg>
      </div>
      <!-- <h3>Hello</h3> -->
    </div>
    <div>
      <button class="create" @click="toggleCreatePanel(); toggleFeedMenu().value = false;" ref="createButton" title="Toggle create panel">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z"/></svg>
      </button>
    </div>
    <button v-if="currentPage === 'index'" class="layout" ref="layoutButton" title="Change layout">
      <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M180 546q-24 0-42-18t-18-42V276q0-24 18-42t42-18h600q24 0 42 18t18 42v210q0 24-18 42t-42 18H180Zm0-60h600V276H180v210Zm0 450q-24 0-42-18t-18-42V666q0-24 18-42t42-18h600q24 0 42 18t18 42v210q0 24-18 42t-42 18H180Zm0-60h600V666H180v210Zm0-600v210-210Zm0 390v210-210Z"/></svg>
    </button>
  </nav>
</template>

<script lang="ts" setup>
const props = defineProps(['currentPage']);

const createButton: Ref = ref(null);
const layoutButton: Ref = ref(null);

watch(isCreatingIndex(), (val) => {
  if (val === true) {
    createButton.value.classList.add('active');
    layoutButton.value.classList.add('inactive');
  } else {
    createButton.value.classList.remove('active');
    layoutButton.value.classList.remove('inactive');
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
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3.5rem;
  width: 100%;
  height: 3.5rem;
  margin: 2rem 0rem;
  margin-bottom: 1rem;
  background-color: var(--panel-color);
  border: 1px solid var(--panel-border-color);
  border-radius: 0.4rem;
  cursor: grab;
  
  div {
    display: flex;
    max-height: 3.5rem;
    justify-content: flex-start;
  }
}

.bar-content {
  position: relative;
  // padding: 1rem;

  .drag-handle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0rem;
    bottom: 0rem;
    left: 0rem;
    width: 2rem;
    cursor: grab;
    background-color: rgba(0,0,0,0.05);

    svg {
      position: relative;
      height: 1.5rem;
      width: 1.5rem;
      fill: var(--text-color);
      opacity: 0.2;
    }
  }


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

button.layout {
  background-color: transparent;
  position: absolute;
  right: -2.8rem;
  top: 0.9rem;
  opacity: 0.2;
  transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);

  svg {
    width: 1.5rem;
    height: 1.5rem;
    fill: var(--text-color);
  }

  &:hover {
    opacity: 1;
  }

  &.inactive {
    opacity: 0;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>