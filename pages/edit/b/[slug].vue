<template>
  <EditBranchesHeadPending v-if="!canViewPage" />
  <EditBranchesHead v-if="canViewPage" :branchData="branchData" />
  <div v-if="canViewPage" class="modals">
    <EditBranchesModalBackgroundImage v-if="backgroundImageModalEnabled().value" :branchData="branchData"/>
  </div>
</template>

<script lang="ts" setup>
const { status, data } = useSession();

const authorised: Ref = ref(false);
const branchExists: Ref = ref(false);

const canViewPage = computed(() => {
  return authorised.value && branchExists.value;
});

const { slug } = useRoute().params;

// --------------------- Auth -------------------------
if (status.value !== 'authenticated') {
  console.log('You are not logged in');
  authorised.value = false;
}

// Get branch data
const { data: branchData, pending } = await useLazyFetch(`/api/branches/get/branch?name=${slug}`);


watch(pending, (val) => {
  if (val === true) {
    return;
  }

  if (branchData.value === null) {
    console.log('Branch does not exist')
    branchExists.value = false;
  }
  else {
    branchExists.value = true;
  
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
});
// Check if branch exists

//

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