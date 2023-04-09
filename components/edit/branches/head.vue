<template>
  <header class="head">
    <div class="introduction">
      <h1 class="title">EDITING BRANCH</h1>
      <h2 class="title">b/{{ branchData.branch.branch_name }}</h2>
    </div>
    <div class="edit-branch-navbar">
      <nav>
        <ul>
          <li>
            <button class="active">
              <h3>General</h3>
            </button>
          </li>
          <li>
            <button class="">
              <h3>Metadata</h3>
            </button>
          </li>
          <li>
            <button class="">
              <h3>Pages</h3>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <EditBranchesModalBackgroundImage v-if="backgroundImageModalEnabled().value" :branchData="branchData"/>
</template>

<script lang="ts" setup>
const props = defineProps(['branchData'])

// ---------------------- Modal ----------------------
function toggleEditBackgroundModal() {
  backgroundImageModalEnabled().value = !backgroundImageModalEnabled().value;
}
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
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-color);
    }

    h2 {
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--text-color);
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
        // border-bottom: 1px solid var(--panel-border-color);
        background-color: var(--panel-color);
        color: var(--panel-text-color);
        cursor: pointer;
        transition: 
          background-color 0.3s cubic-bezier(0.075, 0.82, 0.165, 1),
          border-bottom 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

        &:hover {
          background-color: var(--panel-hover-color);

          h3 {
            opacity: 1;
          }
        }

        p {
          width: 4rem;
          height: 1.2rem;
          animation-delay: 0.3s;
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

          p {
            animation-delay: 0.5s;
            min-width: 5rem;
          }
        }

        button.active {
          border-right: 1px solid var(--panel-border-color);
        }
      }
      
      &:last-of-type {
        button {
          border-top-right-radius: 0.5rem;
          border-right: 1px solid var(--panel-border-color);

          p {
            animation-delay: 1s;
            min-width: 4rem;
          }
        }

        button.active {
          border-left: 1px solid var(--panel-border-color);
        }
      }
    }
  }
}
</style>