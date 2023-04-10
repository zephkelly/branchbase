<template>
  <header class="head">
    <div class="introduction">
      <div class="text">
        <h1 class="title">EDITING BRANCH:</h1>
        <h2 class="title">b/{{ branchData.branch.branch_name }}</h2>
      </div>
      <div class="icon">
        <div class="container">
          <img :src="branchData.branch.icon_image" alt="Branch icon">
        </div>
      </div>
    </div>
    <div class="edit-branch-navbar">
      <nav>
        <ul>
          <li>
            <button ref="generalPageButton" class="active" @click="editBranchActivePage().value = 'general'">
              <h3>General</h3>
            </button>
          </li>
          <li>
            <button ref="metadataPageButton" class="" @click="editBranchActivePage().value = 'metadata'">
              <h3>Metadata</h3>
            </button>
          </li>
          <li>
            <button ref="pagesPageButton" class="" @click="editBranchActivePage().value = 'page'">
              <h3>Pages</h3>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
const props = defineProps(['branchData'])

// -------------- Sub page navigation ------------------
const generalPageButton: Ref = ref(null);
const metadataPageButton: Ref = ref(null);
const pagesPageButton: Ref = ref(null);
watch(editBranchActivePage, (val) => {
  if (val.value === 'general') {
    generalPageButton.value.classList.add('active');
    metadataPageButton.value.classList.remove('active');
    pagesPageButton.value.classList.remove('active');
  }
  else if (val.value === 'metadata') {
    generalPageButton.value.classList.remove('active');
    metadataPageButton.value.classList.add('active');
    pagesPageButton.value.classList.remove('active');
  }
  else if (val.value === 'page') {
    generalPageButton.value.classList.remove('active');
    metadataPageButton.value.classList.remove('active');
    pagesPageButton.value.classList.add('active');
  }
});
</script>

<!-- Not Pending -->
<style lang="scss" scoped>
header.head {
  position: sticky;
  top: -5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 3rem;
  height: 15rem;
  background-color: var(--panel-color);
  border-bottom: 1px solid var(--panel-border-color);
  box-sizing: border-box;
  width: 100%;

  * {
    box-sizing: border-box;
  }

  > div {
    width: 700px;
    max-width: 700px;
    min-height: 6rem;
    max-height: 6rem;
    height: 6rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .introduction {
    display: grid;
    grid-template-columns: 1fr 7rem;

    .text {
      max-height: 6rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-end;

      h1 {
        position: relative;
        left: -2px;
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-color);  
      }
      
      h2 {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-color);
        opacity: 0.8;
      }
    }

    .icon {
      position: relative;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      max-width: 100%;
      height: 6rem;
      max-height: 6rem;
      
      .container {
        position: relative;
        border-radius: 50%;
        overflow: hidden;
        width: 7rem;
        height: 7rem;
        margin-top: 2.5rem;
        border: 1px solid var(--panel-border-color);

        img {
          height: auto;
          width: 100%;
        }
      }
    }
  }
}

.edit-branch-navbar {
  nav {
    li {
      button {
        border-bottom: 1px solid var(--panel-border-color);
      }
    }
  }
}
</style>

<!-- Global style to be shared with pending on [slug] -->
<style lang="scss">
.edit-branch-navbar {
  position: relative;

  nav {
    ul {
      display: flex;
      flex-direction: row;
    }

    li {
      button {
        font-size: 1.1rem;
        font-weight: 500;
        height: 2.8rem;
        min-width: 6rem;
        padding: 0.5rem 1.6rem;
        border-top: 1px solid var(--panel-border-color);
        background-color: var(--panel-color);
        color: var(--panel-text-color);
        cursor: pointer;
        transition: background-color 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

        &:hover {
          background-color: var(--panel-hover-color);

          h3 {
            opacity: 1;
          }
        }

        h3 {
          opacity: 0.4;
        }
      }

      button.active {
        background-color: var(--background-color);
        border-bottom: 1px solid var(--background-color);
        border-left: 1px solid var(--panel-border-color);
        border-right: 1px solid var(--panel-border-color);
        color: var(--text-color);

        &:hover {
          background-color: var(--panel-hover-color);
          border-bottom: 1px solid var(--panel-border-color);
        }

        h3 {
          opacity: 1;
        }
      }
      
      &:first-of-type {
        button {
          border-top-left-radius: 0.5rem;
          border-left: 1px solid var(--panel-border-color);
        }

        button.active {
          border-right: 1px solid var(--panel-border-color);
        }
      }
      
      &:last-of-type {
        button {
          border-top-right-radius: 0.5rem;
          border-right: 1px solid var(--panel-border-color);
        }

        button.active {
          border-left: 1px solid var(--panel-border-color);
        }
      }
    }
  }
}
</style>