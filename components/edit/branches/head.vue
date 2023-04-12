<template>
  <header class="head">
    <div class="introduction">
      <div class="text">
        <h1 class="title">Editing</h1>
        <h2 class="title">b/{{ branchData.branch.branch_name }}</h2>
      </div>
      <div class="icon">
        <div class="container">
          <button class="disabled">Save</button>
        </div>
      </div>
    </div>
    <EditBranchesNavpanel />
  </header>
</template>

<script lang="ts" setup>
const props = defineProps(['branchData'])
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
      flex-direction: row;
      align-items: flex-end;
      justify-content: flex-start;

      h1 {
        position: relative;
        left: -2px;
        font-size: 2.2rem;
        font-weight: 700;
        color: var(--text-color);
        margin-right: 0.3em;  
      }
      
      h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-color);
        opacity: 0.8;
      }
    }

    .icon {
      position: relative;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      max-width: 100%;
      height: 6rem;
      max-height: 6rem;

      button {
      width: 6rem;
      height: 2.6rem;
      border-radius: 0.5rem;

        &:hover {
          background-color: var(--panel-hover-color);
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