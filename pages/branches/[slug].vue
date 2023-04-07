<template>
    <BranchesBranchHead :branchData="branchData" :isPending="pending"/>
  <section class="post-feed">
    <ControlBar :currentPage="'branch'"/>
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
section.post-feed {
  width: 600px;
}
</style>