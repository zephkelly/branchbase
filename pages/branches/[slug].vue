<template>
  <header class="branch-header">
    <BranchesBranchHead :branchData="branchData" v-if="!pending"/>
  </header>
  <section class="post-feed">
    <ControlBar :currentPage="'branch'" v-if="!pending"/>
  </section>
</template>

<script lang="ts" setup>
import { regexDisplayIdRaw } from '@/utils/filterName';
const { status, data } = useSession();

const { slug } = useRoute().params;

//Get branch data
const { data: branchData, pending } = await useLazyFetch(`/api/branches/get-branch?name=${slug}`);

watch(pending, (newPending) => {
  if (newPending === false) {
    const userId = regexDisplayIdRaw(data?.value?.user?.name);
    //@ts-expect-error
    const branchOwnerId = branchData?.value?.branchMeta?.owner_user_id;

    if (userId !== branchOwnerId) {
      console.log('You are not the owner of this branch');
    } else {
      console.log('You are the owner of this branch');
    }
  }
});

definePageMeta({
  layout: 'center-align',
}) 
</script>

<style lang="scss" scoped>
header.branch-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  height: 12rem;
  width: 100%;
  margin-top: 3rem;
  background-color: var(--panel-color);
  border-bottom: 1px solid var(--panel-border-color);

  * {
    box-sizing: border-box;  
  }
}

section.post-feed {
  width: 600px;
}
</style>