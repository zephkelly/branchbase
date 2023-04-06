<template> 
  <header class="branch-header">
    <div class="title">
      <h1>{{ props.branchMeta.branch_title }}</h1>
      <p>b/{{ props.branchMeta.branch_name }}</p>
    </div>
  </header>
</template>

<script lang="ts" setup>
const props = defineProps(['branchMeta'])
</script>

<style lang="scss" scoped>
header.branch-header {
  position: relative;
  height: 200px;
  padding: 1rem;
  margin-top: 3rem;

  .title {
    h1 {
      font-size: 1.5rem;
      font-weight: 400;
      margin: 0;
    }

    p {

    }
  }
}
</style>