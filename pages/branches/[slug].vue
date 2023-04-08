<template>
  <BranchesBranchHead :branchData="branchData" :isPending="pending"/>
  <section class="post-feed">
    <ControlBar :currentPage="'branch'"/>
    <PostsPost />
    <PostsPost />
    <PostsPost />
    <PostsPost />
  </section>
</template>

<script lang="ts" setup>
import { regexDisplayIdRaw } from '@/utils/filterName';
const { status, data } = useSession();

const { slug } = useRoute().params;

//Get branch data
const { data: branchData, pending } = await useLazyFetch(`/api/branches/get-branch?name=${slug}`);

definePageMeta({
  layout: 'center-align',
}) 
</script>

<style lang="scss" scoped>
section.post-feed {
  width: 600px;
}
</style>