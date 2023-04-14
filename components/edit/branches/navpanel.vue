<template>
<section class="edit-navpanel">
  <nav>
    <ul>
      <li>
        <button ref="generalPageButton" class="active" @click="editBranchActivePage().value = 'general'">
          <h3>General</h3>
        </button>
      </li>
      <li>
        <button ref="pagesPageButton" class="" @click="editBranchActivePage().value = 'page'">
          <h3>Pages</h3>
        </button>
      </li>
    </ul>
  </nav>
</section>
</template>

<script lang="ts" setup>
// -------------- Sub page navigation ------------------
const generalPageButton: Ref = ref(null);
const pagesPageButton: Ref = ref(null);
watch(editBranchActivePage, (val) => {
  if (val.value === 'general') {
    generalPageButton.value.classList.add('active');
    pagesPageButton.value.classList.remove('active');
  }
  else if (val.value === 'page') {
    generalPageButton.value.classList.remove('active');
    pagesPageButton.value.classList.add('active');
  }
});
</script>

<style lang="scss">
.edit-navpanel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 700px;
  max-width: 700px;
  height: 100%;
  top: 0.5px;

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
        border-bottom: 1px solid var(--panel-border-color);
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
