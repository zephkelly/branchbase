<template>
  <Transition name="fade">
    <div v-show="isCreating().value" class="create-panel">
      <nav class="options">
        <ul>
          <li>
            <button class="create-post active" @click="isCreatePost = true" ref="createBranch" alt="Create a post" title="Create a post">
              <h3 class="title">Create a post</h3>
            </button>
          </li>
          <li>
            <button class="create-post inactive" @click="isCreatePost = false" ref="createPost" alt="Create a branch" title="Create a branch">
              <h3 class="title">Create a branch</h3>
            </button>
          </li>
          <li>

          </li>
          <li>
            <button class="close" @click="isCreating().value = false" alt="Close" title="Close the create panel">
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
            </button>
          </li>
        </ul>
      </nav>
      <section class="content">
        <Transition name="fade">
          <div v-if="isCreatePost" class="create-post">
            <div class="title">
              <h3>Post title</h3>
              <input type="text" placeholder="Title">
            </div>
            <div class="content">
              <h3>Content</h3>
              <textarea placeholder="Content"></textarea>
            </div>
            <div class="submit">
              <button class="submit" alt="Submit" title="Submit">
                <h3>Submit</h3>
              </button>
            </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="!isCreatePost" class="create-branch">
              <div class="title">
                <h3>Branch title</h3>
                <input type="text" placeholder="Title">
              </div>
            </div>
          </Transition>
      </section>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const createPost: Ref = ref(null);
const createBranch: Ref = ref(null);
const isCreatePost = ref(true);
watch(isCreatePost, (value) => {
  if (value) {
    createPost.value?.classList.remove('active');
    createPost.value?.classList.add('inactive');

    createBranch.value?.classList.add('active');
    createBranch.value?.classList.remove('inactive');
  } else {
    createPost.value?.classList.remove('inactive');
    createPost.value?.classList.add('active');

    createBranch.value?.classList.remove('active');
    createBranch.value?.classList.add('inactive');
  }
});
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

nav {
  position: relative;
  height: 3.5rem;

  ul {
    display: grid;
    grid-template-columns: 1fr 1fr 0.6fr 3.5rem;
    height: 100%;

    li {
      height: 100%;
      
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        background-color: var(--panel-color);
        border: none;
        transition: background-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
        
        &:hover {
          background-color: var(--panel-hover-color);
        }

        h3 {
          color: var(--text-color);
          font-family: 'Roboto', sans-serif;
          font-size: 1rem;
          transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
      }

      button.inactive {
        background-color: var(--panel-hover-color-inverted);
        border-bottom: 1px solid var(--panel-border-color);

        h3 {
          opacity: 0.4;
        }

        &:hover {
          background-color: var(--panel-hover-color);

          h3 {
            opacity: 1;
          }
        }
      }

      &:nth-child(1) button.active {
        border-radius: 0.4rem 0rem 0rem 0rem;
        border-right: 1px solid var(--panel-border-color);
      }

      &:nth-child(2) button.active {
        border-left: 1px solid var(--panel-border-color);
        border-right: 1px solid var(--panel-border-color);
      }

      &:nth-child(3){
        background-color: var(--panel-hover-color-inverted);
        border-bottom: 1px solid var(--panel-border-color);
        height: 3.48rem;
      }
    }
  }

  button.close {
    position: absolute;
    justify-content: center;
    right: 0rem;
    height: 100%;
    width: 3.5rem;
    padding: 0rem;
    border-radius: 0rem 0.4rem 0rem 0rem;
    cursor: pointer;
    border-left: 1px solid var(--panel-border-color);
  
    svg {
      height: 48%;
      width: 48%;
      fill: var(--text-color);
    }
  }
}

section.content {
  > div {
    padding: 1rem;
    position: absolute;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>