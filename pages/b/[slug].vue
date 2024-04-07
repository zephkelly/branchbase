<template>
  <BranchesBranchHead :branchData="null" :isPending="pending" v-if="pending"/>
  <BranchesBranchHead :branchData="branchData" :isPending="pending" v-else/>
  <div class="overflow" ref="overflowY" >
    <section class="post-feed">
        <ControlBar :currentPage="'branch'"/>
        <CreatePanel />
        <div class="post-container" ref="postsContainer">
            <section class="posts">
                <div class="fade"></div>
                <PostsPost3 class="text" />
                <PostsPost class="text rising"/>
                <PostsPost />
                <PostsPost />
                <PostsPost />
                <PostsPost />
                <PostsPost />
                <PostsPost />
            </section>
        </div>
    </section>
  </div>  
</template>

<script lang="ts" setup>
const { slug } = useRoute().params;

//Get branch data
const { data: branchData, pending } = await useLazyFetch(`/api/branches/get/branch?name=${slug}`);

const overflowY: Ref = ref(null)
const postsContainer: Ref = ref(null)
watch(isCreatingBranch, (newIsCreating) => {
  if (newIsCreating.value === true) {
    postsContainer.value.classList.add('creating');
    overflowY.value.style.height = 'calc(100vh + 0.5rem - 14rem)';
  } else {
    postsContainer.value.classList.remove('creating');
    overflowY.value.style.height = '100%';
  }
})

onBeforeUnmount(() => {
    isCreatingBranch().value = false;
})

definePageMeta({
  layout: 'center-align',
}) 
</script>

<style lang="scss" scoped>
.overflow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  min-height: 680px;
  overflow-y: hidden;
}

section.post-feed {
  width: 600px;
  position: relative;
}

.post-container {
    .posts {
    transition: transform 0.15s cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;

    .fade {
      z-index: -100;
      top: 0rem;
      left: -1.8rem;
      position: absolute;
      width: 110%;
      height: 80rem;
      background: linear-gradient(0deg, rgba(255,255,255,0) 0%, var(--background-color) 100%);
      opacity: 0;
      transition: opacity 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
    }
  }
}

.post-container.creating {
  .posts {
    transform: translateY(36rem);
    transition: transform 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);
    
    .fade {
      z-index: 10;
      opacity: 1;   
    }
  }
}
</style>