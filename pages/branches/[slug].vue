<template>
  <section v-show="!pending">
    <BranchesBranchHead :branchMeta="branch" />
  </section>
</template>

<script lang="ts" setup>
import { Branches_Metadata } from '~~/models/branches';
const { slug } = useRoute().params;

//Get branch data
const { data: data, pending } = await useFetch(`/api/branches/get-branch?name=${slug}`);
//@ts-expect-error
const branch: Ref = ref(data?.value?.branch as Branches_Metadata);
</script>