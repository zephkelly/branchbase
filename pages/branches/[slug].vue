<template>
  <section v-show="!pending">
    <BranchesBranchHead :branchData="branch" />
  </section>
</template>

<script lang="ts" setup>
// import { Branches_Metadata } from '~~/models/branches';
const { slug } = useRoute().params;

//Get branch data
const { data: data, pending } = await useFetch(`/api/branches/get-branch?name=${slug}`);

const branch: Ref = ref(data?.value);
</script>