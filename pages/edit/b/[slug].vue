<template>
  <!-- Header -->
  <EditBranchesHead v-if="canViewPage" :branchData="branchData" />
  <EditBranchesHeadPending v-else />
  <!-- Pages -->
  <div v-if="canViewPage" class="pages">
    <EditBranchesPageGeneral :branchData="branchData" />
  </div>
  <section v-else class="pages"></section>
  <!-- Modals -->
  <div v-if="canViewPage" class="modals">
    <EditBranchesModalBackgroundImage v-if="backgroundImageModalEnabled().value" :branchData="branchData"/>
  </div>
</template>

<script lang="ts" setup>
const { status, data } = useSession();
const { slug } = useRoute().params;

const authorised: Ref = ref(false);
const branchExists: Ref = ref(false);
const canViewPage = computed(() => {
  return authorised.value && branchExists.value;
});

// Get branch data
const { data: branchData, pending } = await useLazyFetch(`/api/branches/get/branch?name=${slug}`);

checkIsAuthorised();

watch(branchData, (val) => {
  checkIsAuthorised();  
});

function checkIsAuthorised() {
  if (branchData.value === null) {
    console.log('Branch does not exist')
    branchExists.value = false;
  }
  else {
    branchExists.value = true;

    if (status.value !== 'authenticated') {
      console.log('You are not logged in');
      authorised.value = false;
    }
  
    //Check if user is authorised to view this page
    //@ts-expect-error
    const owner_id = branchData.value.branchMeta.owner_user_id;
  
    if (owner_id !== regexDisplayId(data)) {
      console.log('You are not authorised to view this page');
      authorised.value = false;
    } else {
      console.log('You are authorised to view this page');
      authorised.value = true;
    }
  }
}

// ---------------------- Modal ------------------------
watch(backgroundImageModalEnabled(), (val) => { toggleFixedBody(val); });

// Toggle fixed body
function toggleFixedBody(val: boolean) {
  const scrollYAbsolute = window.scrollY;

  if (val === true) {
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYAbsolute}px`;
  } else {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }
}

function toggleEditBackgroundModal() {
  backgroundImageModalEnabled().value = !backgroundImageModalEnabled().value;
}

// Disabled all modals
function disableActiveModals() {
  if (backgroundImageModalEnabled().value === true) {
    backgroundImageModalEnabled().value = false;
  }
}

definePageMeta({
  layout: 'center-align',
}) 
</script>

<!-- Shared with children -->
<style lang="scss" scoped>
  .pages {
    height: calc(100vh - 21rem);
    width: 100%;
    padding-top: 6rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--panel-color);

    .page {
      width: 700px;
      max-width: 700px;

      > div {

      }
    }
  }
</style>