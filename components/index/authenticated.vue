<template>
  <section class="posts-feed">
    <div v-if="pending" class="">
      <p style="margin-top: 3rem;">Loading</p>>
    </div>
    <div v-else class="posts">
      <div v-for="post in posts">
        <post />
      </div>
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
.posts-feed {
  width: 660px;
  height: 100vh;
}

article.post {
  width: 100%;
  height: 100%;
  background-color: var(--panel-color);
}
</style>