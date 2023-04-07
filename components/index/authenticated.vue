<template>
  <section class="posts-feed">
    <ControlBar :currentPage="'index'" />
    <IndexCreatePanel />
    <div v-if="pending" class="posts-pending">
      <p style="margin-top: 3rem;">Loading</p>
    </div>
    <div v-else ref="postsContainer" class="posts-loaded">
      <section class="posts">
        <div class="fade"></div>
        <PostsPost class="text" />
        <PostsPost class="text rising"/>
        <PostsPost class="media" />
        <PostsPost class="media rising" />
      </section>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { pending, data: posts } = useLazyFetch('/api/posts')
watch(posts, (newPosts) => {
  // Because posts starts out null, you will not have access
  // to its contents immediately, but you can watch it.
})

const postsContainer: Ref = ref(null)
watch(isCreatingIndex, (newIsCreating) => {
  if (newIsCreating.value === true) {
    postsContainer.value.classList.add('creating');
  } else {
    postsContainer.value.classList.remove('creating');
  }
})

onUnmounted(() => {
  isCreatingIndex().value = false;
})
</script>

<style lang="scss" scoped>
section.posts-feed {
  position: relative;
  width: 600px;
  margin-top: 3rem;
  margin-bottom: 6rem;
  box-sizing: border-box;
}

.posts-loaded {
  width: 100%;
  height: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .posts {
    transition: transform 0.15s cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;

    .fade {
      z-index: -100;
      top: 0rem;
      left: -1.8rem;
      position: absolute;
      width: 110%;
      height: 80rem;
      background: linear-gradient(0deg, rgba(255,255,255,0) 0%, var(--background-color) 100%);
      opacity: 0;
      transition: opacity 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
    }
  }
}

.posts-loaded.creating {
  .posts {
    transform: translateY(36rem);
    transition: transform 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);
    
    
    .fade {
      z-index: 10;
      opacity: 1;   
    }
  }
}
</style>