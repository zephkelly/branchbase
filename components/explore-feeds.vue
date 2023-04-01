<template>
  <section class="feeds">
    <h6 class="title">Feeds</h6>
    <p class="subtitle">Content curated by topic</p>
    <nav>
      <!-- <p class="label">TOPICS</p> -->
      <ul>
        <li>
          <img>
          <nuxt-link>News</nuxt-link>
        </li>
        <li>
          <img>
          <nuxt-link>New</nuxt-link>
        </li>
        <li>
          <img>
          <nuxt-link>Rising</nuxt-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

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
  margin-top: 1.5rem;
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
  margin-bottom: 1rem;
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

section.feeds {
  width: 100%;
  margin-bottom: 2rem;

  nav {
    ul {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding-bottom: 1rem;
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
        font-family: 'Roboto', sans-serif;
        cursor: pointer;

        &:hover {
          background-color: rgb(40, 40, 40);
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
      padding-left: 1rem;
      padding-right: 1.5rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>