<template>
  <section class="branches-explore">
    <h6 class="title">Explore Communities</h6>
    <p class="subtitle">Join the discussion</p>
    <nav>
      <div v-if="pending">
        Loading ...
      </div>
      <ul v-else>
        <!-- <p class="label">BRANCHES</p> -->
        <li v-for="branch in branches?.body.branches" :title="branch.description">
          <img>
          <a>b/{{ branch.name }}</a>
        </li>
        <div v-if="!loadMoreBranches" class="more-button">
          <a v-on:click="loadMore">+ More</a>
        </div>
        <li v-else v-for="branch in moreBranches.data.value.body.branches" :title="branch.description">
          <img>
          <a>b/{{ branch.name }}</a>
        </li>
        <div v-if="loadMoreBranches" class="more-button">
            <a href="">+ View all</a>
        </div>
      </ul>
    </nav>
  </section>
</template>

<script lang="ts" setup>
const branchList = ref([]);
const limit: number = 6;

const { data: branches, pending, refresh, error } = useFetch(`/api/branches?page=1&limit=${limit}`);

const loadMoreBranches = ref(false);
const moreBranches = useFetch(`/api/branches?page=2&limit=12&lastLimit=${limit}`);

function loadMore() {
  loadMoreBranches.value = true;
}

defineExpose({
  branchList,
  moreBranches,
  loadMore,
})
</script>

<style lang="scss" scoped>
.branches-explore {
  width: 100%;

  nav {
    ul {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      // margin-bottom: 0.5rem;
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      gap: 0rem;
      color: var(--text-color);

      li {
        width: 100%;
        height: 2.4rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;

        &:hover {
          cursor: pointer;
          background-color: rgb(54, 54, 54);
        }

        &:last-of-type {
          border-radius: 0rem 0rem 0.4rem 0.4rem;
        }
        
        img {
          width: 1.2rem;
          height: 1.2rem;
          min-width: 1.2rem;
          min-height: 1.2rem;
          border-radius: 100%;
          margin-left: 1.5rem;
          background-color: rgb(255, 255, 255);
        } 
      }
    }

    a {
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      padding-left: 0.8rem;
      padding-right: 1.5rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .more-button {
      display: flex;
      align-items: center;
      width: 100%;
      height: 2.4rem;
      margin-top: 0.5rem;
      opacity: 0.8;
      cursor: pointer;

      a {
        padding-left: 1.5rem;
      }

      &:hover {
        background-color: rgb(40, 40, 40);
      }
    }

    .all {
      display: flex;
      align-items: center;
      height: 2.4rem;
      margin-top: 0.5rem;
      opacity: 0.7;
      cursor: pointer;

      a {
        padding-left: 1.5rem;
      }

      &:hover {
        background-color: rgb(40, 40, 40);
      }
    }
  }
}
</style>