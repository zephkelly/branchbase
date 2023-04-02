<template>
  <section class="posts-feed">
    <div v-if="pending" class="">
      <p style="margin-top: 3rem;">Loading</p>>
    </div>
    <div v-else class="posts">
      <div v-for="post in posts">
        <post />
      </div>
      <nav class="control-bar">

      </nav>
      <article class="post text">
        <header>
          <div class="post-info">
            <div class="branch-attributes">
              <div class="branch-icon">
                <img>
              </div>
              <nuxt-link class="branch-name">b/programming</nuxt-link>
              <p class="dot">.</p>
              <p class="post-time">1hr ago</p>
            </div>
            <div class="user-attributes">
              <p class="user-name"><span>posted by</span> <nuxt-link>zephisthebomb</nuxt-link></p>
            </div>
          </div>
          <h3 class="title">Post title that is a little bit longer and is cray cray long like why the fuck do you keep rambling on and on and then you just know that you are a loser brain ryan fart</h3>
        </header>
        <section class="body">
          <p>
            Here is the actual body of the text, see i am stupid because 
            Here is the actual body of the text, see i am stupid because 
            Here is the actual body of the text, see i am stupid because 
            Here is the actual body of the text, see i am stupid because 
            Here is the actual body of the text, see i am stupid because
          </p>
          <p>
            Here is the actual body of the text, see i am stupid because 
            Here is the actual body of the text, see i am stupid because 
            Here is the actual body of the text, see i am stupid because 
            Here is the actual body of the text, see i am stupid because 
            Here is the actual body of the text, see i am stupid because
          </p>
        </section>
        <footer>

        </footer>
      </article>
      <article class="post">

      </article>
      <article class="post">
      </article>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { pending, data: posts } = useLazyFetch('/api/posts')
watch(posts, (newPosts) => {
  // Because posts starts out null, you will not have access
  // to its contents immediately, but you can watch it.
})
</script>

<style lang="scss" scoped>
section.posts-feed {
  width: 600px;
  margin-top: 3rem;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
}

.posts {
  width: 100%;
  height: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.control-bar {
  width: 100%;
  height: 4.5rem;
  margin: 2rem 0rem;
  margin-bottom: 1rem;
  background-color: var(--panel-color);
  border: 1px solid var(--panel-border-color);
}

.post {
  width: 100%;
  height: auto;
  min-height: 10rem;
  max-height: 600px;
  margin: 1.5rem 0rem;
  background-color: var(--panel-color);
  border-radius: 0.3rem;
  border: 1px solid var(--panel-border-color);
  transition: border-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);

  &:hover {
    border: 1px solid var(--panel-border-hover-color);
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1rem;

    div.post-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      height: 1.2rem;
      margin-bottom: 0.4rem;

      > div {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      div.branch-attributes {   
        div.branch-icon {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          margin-right: 0.4rem;
          overflow: hidden;

          img {
            cursor: pointer;
            width: 100%;
            height: 100%;
            object-fit: cover;
            background-color: var(--text-color);
          }
        }

        p, a {
          height: 0.8rem;
          display: flex;
          align-items: flex-end;
          font-size: 0.8rem;
          font-weight: 500;
          font-family: 'Roboto', sans-serif;
          color: var(--text-color-darker);
        }

        a {
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease-in-out;

          &:hover {
            color: var(--text-color);
          }
        }

        p.dot {
          font-size: 1.2rem;
          margin-right: 0.3rem;
          margin-left: 0.4rem;
          opacity: 0.7;
        }

        p.post-time {
          font-size: 0.7rem;
          opacity: 0.7;
        }
      }

      div.user-attributes {
        justify-content: flex-end;
        width: 100%;
        height: 1.2rem;

        .user-name {
          font-size: 0.8rem;
          font-weight: 500;
          font-family: 'Roboto', sans-serif;
          color: var(--text-color-darker);
          text-align: right;

          a {
            text-decoration: none;
            cursor: pointer;
            transition: color 0.2s ease-in-out;

            &:hover {
              color: var(--text-color);
            }
          }

          span {
            font-weight: 400;
            opacity: 0.7;
          }
        }
      }
    }

    h3.title {
      width: 100%;
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.2em;
      font-family: 'Roboto', sans-serif;
      color: var(--text-color);
    }
  }

  section.body {
    width: 100%;
    min-height: 200px;
    padding: 1rem 1rem;

    p {
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 400;
      line-height: 1.4em;
      opacity: 0.8;
      color: var(--text-color);
    }
  }

  footer {
    width: 100%;
    height: 3rem;
    padding: 0.5rem 1rem;
    border-top: 1px solid var(--panel-border-color);
  }
}

.post {
  &.text {
    section.body {
      min-height: 0rem;
      padding-top: 0.8rem;
      padding-bottom: 0rem;
      background-color: transparent;

      p {
        margin: 1em 0em;

        &:first-child {
          margin-top: 0em;
        }

        &:last-child {
          margin-bottom: 0em;
        }
      }
    }

    section.body:last-child {
      margin-bottom: 0rem;
    }

    footer {
      border-top: none;
    }
  }

  &.media {
    section.body {
      background-color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>