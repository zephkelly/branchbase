<template>
  <EditBranchesHead v-if="canViewPage" :branchData="branchData" />
  <section v-else class="loading">
    <div class="introduction">
      <h1 class="pending-large"></h1>
      <p class="pending"></p>
    </div>
    <div class="edit-branch-navbar">
      <nav>
        <ul>
          <li>
            <button class="active">
              <p class="pending"></p>
            </button>
          </li>
          <li>
            <button>
              <p class="pending"></p>
            </button>
          </li>
          <li>
            <button>
              <p class="pending"></p>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </section>
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

// ------- Check if user is logged in --------
if (status.value !== 'authenticated') {
  console.log('You are not logged in');
  authorised.value = false;
}

//Get branch data
const { data: branchData } = await useFetch(`/api/branches/get/branch?name=${slug}`);

// Check if branch exists
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

// ---------------------- Modal ------------------------
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

<!-- pending -->
<style lang="scss" scoped>
section.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  background-color: var(--panel-color);
  border-bottom: 1px solid var(--panel-border-color);
  box-sizing: border-box;
  width: 100%;

  * {
    box-sizing: border-box;
  }

 div {
  width: 700px;
  height: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  // padding-top: 3rem;

  &.introduction {
    h1 {
     width: 16rem;
     height: 2rem;
    }
 
    p {
     width: 10rem;
     height: 1.2rem;
     margin-top: 0.3em;
    }
  }

  &.edit-branch-navbar {
    position: relative;
    top: 1px;

    button {
      border-bottom: 1px solid var(--panel-border-color);
    }

    button.active {
      border-bottom: none;
    }
  }
 }
}
</style>