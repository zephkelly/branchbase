<template> 
  <header class="branch-header pending" v-if="isPending">
    <div class="background-image">
      <div class="fade"></div>
    </div>
    <div class="title">
      <div class="icon">
      </div>
      <div class="text">
        <h1 class="branch-title pending-large"><title></title></h1>
        <p class="pending"></p>
      </div>
    </div>
  </header>
  <header class="branch-header" ref="branchHeader" v-else>
    <div class="background-image">
      <img :src="props.branchData.branchMeta.background_image">
      <div class="fade"></div>
    </div>
    <div class="branch-info">
      <div class="title">
        <div class="icon" ref="branchIcon">
          <img :src="props.branchData.branch.icon_image">
        </div>
        <div class="text">
          <h1 ref="branchTitle">{{ props.branchData.branchMeta.branch_title }}</h1>
          <p ref="branchId">b/{{ props.branchData.branch.branch_name }}</p>
        </div>
        <div class="branch-interaction">
          <div class="edit" ref="editBranchButton">
            <nuxt-link class="edit-button" :to="`/edit/branches/${props.branchData.branch.branch_name}`">
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M180 876h44l443-443-44-44-443 443v44Zm614-486L666 262l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
const { status, data } = useSession();
const props = defineProps(['branchData', 'isPending']);
const isPending = ref(props.isPending);

// ----------------------Owner check----------------------
watch(isPending, (value) => {
  if (value) {
    return;
  } else {
    if (status.value === 'authenticated') {
      const userId = regexDisplayIdRaw(data.value?.user?.name);
      const branchOwnerId = props.branchData.branchMeta.owner_user_id;

      if (userId !== branchOwnerId) {
        console.log('You are not the owner of this branch');
      } else {
        console.log('You are the owner of this branch');
      }
    }
  }
});

// ------------------ SCROLL ANIMATIONS ------------------
const branchHeader: Ref = ref(null);
let lastScrollY = 0;
let canShrink = false;
function updateHideHeader(progress: number) {
  if (progress < 700) {
    canShrink = false;
  } else {
    canShrink = true;
  }

  if (!canShrink) {
    if (!branchHeader.value.classList.contains('hide')) return;
    branchHeader.value.classList.remove('hide');
    lastScrollY = progress;
    return;
  }

  if (progress < lastScrollY) {
    if (!branchHeader.value.classList.contains('hide')) return;
    branchHeader.value.classList.remove('hide');
  } else {
    if (branchHeader.value.classList.contains('hide')) return;
    branchHeader.value.classList.add('hide');
  }

  lastScrollY = progress;
}

// Scroll responsive icon
const branchIcon: Ref = ref(null);
function updateIconElement(progress: number) {
  const scale = 1 - progress * 0.55;
  const top = `${-3 * (1 - progress) + 0.545}rem`;
  const left = `${(progress * 1.1)}rem`;

  branchIcon.value.style.transform = `scale(${scale})`;
  branchIcon.value.style.top = top;
  branchIcon.value.style.left = left;
};

// Scroll responsive title
const branchTitle: Ref = ref(null);
const branchId: Ref = ref(null);
function updateTitleELements(progress: number) {
  const titleOpacity = `${(1 - progress)}`;
  const left = `-${(progress * 0.8)}rem`;

  let idOpacity = progress;
  let fontWeight = 400;
  let fontSize = '1rem';

  if (progress < 0.6) {
    idOpacity = 0.6;
  }

  if (progress == 1) {
    fontSize = '1.5rem';
    fontWeight = 600;
  }

  branchTitle.value.style.opacity = titleOpacity;

  branchId.value.style.opacity = idOpacity;
  branchId.value.style.fontSize = fontSize;
  branchId.value.style.fontWeight = fontWeight;
  branchId.value.style.left = left;
};

// Scroll responsive edit
const editBranchButton: Ref = ref(null);
function updateEditElement(progress: number) {
  const opacity = `${(1 - progress)}`;
  
  editBranchButton.value.style.opacity = opacity

  if (progress == 1) {
    if (editBranchButton.value.style.display === 'none') return;
    editBranchButton.value.style.display = 'none';
  } else {
    if (editBranchButton.value.style.display === 'block') return;
    editBranchButton.value.style.display = 'block';
  }
};

function calculateScroll() {
  let scrollYAbsolute = window.scrollY;
  let scrollY = scrollYAbsolute;

  const minScroll = 50;
  const maxScroll = 130;

  if (scrollY > maxScroll) {
    scrollY = maxScroll;
  }

  if (scrollY < minScroll) {
    scrollY = minScroll;
  }

  const progress: number = (scrollY - minScroll) / (maxScroll - minScroll);

  updateIconElement(progress);
  updateTitleELements(progress);
  updateEditElement(progress);

  updateHideHeader(scrollYAbsolute);
}

onMounted(() => {
  window.addEventListener('scroll', calculateScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', calculateScroll);
});
</script>

<!-- Heading loaded -->
<style lang="scss" scoped>
header.branch-header {
  position: sticky;
  top: -5rem;
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
  transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  z-index: 10;
  
  * {
    box-sizing: border-box;  
  }
  
  &.hide {
    transform: translateY(-6rem);
    transition: transform 2s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
}

.branch-info {
  width: 100%;
  display: flex;
  justify-content: center;
}

.title {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 700px;
  height: 6rem;

  .icon {
    position: relative;
    top: -2.5rem;
    min-width: 7rem;
    min-height: 7rem;
    max-width: 7rem;
    max-height: 7rem;
    margin-right: 1rem;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--panel-color);
    border: 1px solid var(--panel-border-color);
    box-shadow: 0rem 0rem 2rem 0.2rem rgba(0, 0, 0, 0.2);
    transition: 
      transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1), 
      top 0.3s cubic-bezier(0.075, 0.82, 0.165, 1), 
      left 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .text {
    width: 100%;
    justify-content: flex-end;
    padding: 1rem 0rem;
    font-family: 'Roboto', 'Inter', sans-serif;

    h1 {
      width: auto;
      position: relative;
      font-size: 2rem;
      font-weight: 700;
    }

    p {
      width: auto;
      position: relative;
      font-weight: 400;
      margin-top: 0.3rem;
      font-size: 1rem;
      opacity: 0.6;
      transition: 
        font-weight 0.3s cubic-bezier(0.075, 0.82, 0.165, 1), 
        font-size 0.3s cubic-bezier(0.075, 0.82, 0.165, 1),
        left 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
}

.background-image {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 6rem;
  max-height: 6rem;
  border-bottom: 1px solid var(--panel-border-color);

  .fade {
    display: flex;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2rem;
    pointer-events: none;
    opacity: 0.4;
    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, black 100%);

    @media (prefers-color-scheme: light) {
      opacity: 0.2;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background-color: rgb(38, 38, 38);
  }
}

.branch-interaction {
  padding-top: 1.25rem;
  width: 1.8rem;

  svg {
    position: relative;
    width: 1.8rem;
    height: 1.8rem;
    fill: var(--text-color);
  }
}
</style>

<!-- Heading Pending -->
<style lang="scss" scoped>
header.pending {
  .title {
    .text {
      h1 {
        height: 2rem;
        width: 16rem;
        animation: pulse 2.2s ease-in-out infinite alternate;
        animation-delay: 0.5s;
      }
  
      p {
        height: 1rem;
        width: 8rem;
        animation: pulse 1.5s ease-in-out infinite alternate;
      }
    }
  }
}
</style>

<!-- Animation -->
<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade2-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade2-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>