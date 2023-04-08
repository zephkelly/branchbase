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
        <li v-for="//@ts-ignore
        branch in branches?.body?.branches" :title="branch.description">
          <nuxt-link :to="'/branches/' + branch.branch_name" @click="toggleFeedMenu().value = false">
            <img :src="branch.icon_image">
            <p>b/{{ branch.branch_name }}</p>
          </nuxt-link>
        </li>
        <div v-if="loadMoreBranches" v-on:click="loadMore" class="more-button">
          <a>+ More</a>
        </div>
      </ul>
    </nav>
  </section>
</template>

<script lang="ts" setup>
const loadMoreBranches = computed(() => {
  //@ts-expect-error
  return moreBranches.data.value.body.branches.length > 0;
});

const showViewAll = ref(false);
const limit: number = 6;

const { data: branches, pending } = await useFetch(`/api/branches?page=1&limit=${limit}`, { pick: ['body']});
const moreBranches = await useFetch(`/api/branches?page=2&limit=12&lastLimit=${limit}`);

function loadMore() {
  //@ts-expect-error
  moreBranches.data.value.body.metadata.totalBranches > moreBranches.data.value.body.branches.length
    ? showViewAll.value = false
    : showViewAll.value = true;
}

defineExpose({
  moreBranches
})
</script>

<style lang="scss" scoped>
h6.title {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 1.6rem;
  width: calc(100% - 3rem);
  color: var(--text-color);
  padding: 1.5rem;
  padding-top: 0rem;
  padding-bottom: 0.4rem;
  margin-bottom: 0rem;
}

p.subtitle {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  width: calc(100% - 3rem);
  color: var(--text-color);
  padding: 1.5rem;
  padding-top: 0rem;
  padding-bottom: 0rem;
  margin-bottom: 0.8rem;
  opacity: 0.6;
}

p.label {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 0.8rem;
  width: calc(100% - 3rem);
  color: var(--text-color);
  padding: 1.5rem;
  padding-top: 0rem;
  padding-bottom: 0.4rem;
  opacity: 0.3;
}
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
        cursor: pointer;

        a {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        &:hover {
          background-color: var(--panel-hover-color);
        }

        &:last-of-type {
          border-radius: 0rem 0rem 0.4rem 0.4rem;
        }
        
        img {
          width: 1.4rem;
          height: 1.4rem;
          min-width: 1.2rem;
          min-height: 1.2rem;
          border-radius: 50%;
          border: 1px solid var(--panel-border-color);
          margin-left: 1.5rem;
        } 
      }
    }

    p {
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-size: 0.95rem;
      padding-left: 1rem;
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