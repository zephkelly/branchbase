<template>
  <section class="posts-feed">
    <div v-if="pending" class="">
      <p style="margin-top: 3rem;">Loading</p>>
    </div>
    <div v-else class="posts">
      <div v-for="post in posts">
        <PostsPost />
      </div>
      <PostsControlBar />
      <PostsPost />
    </div>
  </section>
</template>

<script lang="ts" setup>
const { pending, data: posts } = useLazyFetch('/api/posts')
watch(posts, (newPosts) => {
  // Because posts starts out null, you will not have access
  // to its contents immediately, but you can watch it.
})
</script>

<style lang="scss" scoped>
section.posts-feed {
  width: 600px;
  margin-top: 3rem;
  box-sizing: border-box;
}

.posts {
  width: 100%;
  height: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>