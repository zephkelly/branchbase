<template>
  <section class="branches-explore">
    <h6 class="title">Explore Communities</h6>
    <p class="subtitle">Join the discussion</p>
    <div v-if="pending">
      Loading ...
    </div>
    <nav v-else>
      <ul>
        <p class="label">BRANCHES</p>
        <li v-for="branch in branches?.body" :title="branch.description">
          <img>
          <a>b/{{ branch.name }}</a>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script lang="ts" setup>
const { pending, data: branches } = useLazyFetch('/api/branches');
</script>

<style lang="scss" scoped>
.branches-explore {
  width: 100%;

  h6.title {
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 1.6rem;
    width: calc(100% - 3rem);
    color: var(--text-color);
    padding: 1.5rem;
    padding-top: 2rem;
    padding-bottom: 0.4rem;
  }

  p.subtitle {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    width: calc(100% - 3rem);
    color: var(--text-color);
    padding: 1.5rem;
    padding-top: 0rem;
    padding-bottom: 1.5rem;
    opacity: 0.6;
  }

  p.label {
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 0.8rem;
    width: calc(100% - 3rem);
    color: var(--text-color);
    padding: 1.5rem;
    padding-top: 1.5rem;
    padding-bottom: 0.4rem;
    opacity: 0.3;
  }

  ul {
    list-style: none;
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

      &:hover {
        cursor: pointer;
        background-color: rgb(54, 54, 54);
      }

      &:last-of-type {
        border-radius: 0rem 0rem 0.4rem 0.4rem;
      }

      a {
        padding-left: 0.8rem;
        padding-right: 1.5rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
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
}
</style>