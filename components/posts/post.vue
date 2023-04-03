<template>
  <article ref="postElement" class="post text">
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
      <div class="text-body">
        <div class="content">
          <p>
            Here is the actual body of the text, see i am stupid because
            Here is the actual body of the text, see i am stupid because
            Here is the actual body of the text, see i am stupid because
            Here is the actual body of the text, see i am stupid because
            Here is the actual body of the text, see i am stupid because
          </p>
          <p>
            Here is the actual body of the text, see i am stupid because
           dy of the text, see i am stupid because
          </p>
        </div>
        <div ref="textFadeOut" class="fade"></div>
      </div>
    </section>
    <footer ref="footer">
      <section class="interaction-bar">
        <div class="like">
          <Transition name="fade">
          <svg v-if="isLiked" @click="isLiked = false" class="liked" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
            <path d="m480 935-41-37q-106-97-175-167.5t-110-126Q113 549 96.5 504T80 413q0-90 60.5-150.5T290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.5T880 413q0 46-16.5 91T806 604.5q-41 55.5-110 126T521 898l-41 37Z"/>
          </svg>
          </Transition>
          <Transition name="fade">
            <svg v-if="!isLiked" @click="isLiked = true; isDisliked = false;" class="unliked" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m480 935-41-37q-105.768-97.121-174.884-167.561Q195 660 154 604.5T96.5 504Q80 459 80 413q0-90.155 60.5-150.577Q201 202 290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.423Q880 322.845 880 413q0 46-16.5 91T806 604.5Q765 660 695.884 730.439 626.768 800.879 521 898l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712 630 750.5 580t54-89.135q15.5-39.136 15.5-77.72Q820 347 778 304.5T670.225 262q-51.524 0-95.375 31.5Q531 325 504 382h-49q-26-56-69.85-88-43.851-32-95.375-32Q224 262 182 304.5t-42 108.816Q140 452 155.5 491.5t54 90Q248 632 314 698t166 158Zm0-297Z"/></svg>
          </Transition>
          <p>2</p>
        </div>
        <div class="comment">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M80 976V236q0-23 18-41.5t42-18.5h680q23 0 41.5 18.5T880 236v520q0 23-18.5 41.5T820 816H240L80 976Zm60-145 75-75h605V236H140v595Zm0-595v595-595Z"/></svg>
          <p>20</p>
        </div>
        <div class="comment">
          <svg v-if="isDisliked" @click="isDisliked = false" class="disliked" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M239 216h467v512l-278 288-33-26q-11-8-14.5-18t-3.5-23v-10l45-211H100q-23 0-41.5-18.5T40 668v-82q0-11 2.5-25.5T50 535l116-268q9-21 29.5-36t43.5-15Zm527 512V216h114v512H766Z"/></svg>
          <svg v-if="!isDisliked" @click="isDisliked = true; isLiked = false;" class="undisliked" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M242 216h444v512l-278 288-39-31q-6-5-9-14t-3-22v-10l45-211H103q-24 0-42-18t-18-42v-81.839Q43 579 41.5 571.5T43 557l126-290q8.878-21.25 29.595-36.125Q219.311 216 242 216Zm384 60H229L103 575v93h373l-53 249 203-214V276Zm0 427V276v427Zm60 25v-60h133V276H686v-60h193v512H686Z"/></svg>
          <p>20</p>
        </div>
      </section>
      <section class="more-bar">

      </section>
    </footer>
  </article>
</template>

<script lang="ts" setup>
const postElement: Ref = ref(null);
const footer: Ref = ref(null);

const isLiked = ref(false);
const isDisliked = ref(false);

onMounted(() => {
  // TEXT POST ---------------------------------------
  // Hide the text fade out element if the text is short
  checkTextFadeOut();
});


// TEXT POST ---------------------------------------
const textFadeOut: Ref = ref(null);
function checkTextFadeOut() {
  if (!postElement.value.classList.contains("text")) return;

  const textBody = textFadeOut.value.parentElement;
  const textBodyHeight = textBody.clientHeight;

  if (textBodyHeight < 200) {
    postElement.value.classList.add("short");
  } else {
    postElement.value.classList.remove("short");
  }
}
</script>

<style lang="scss">
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

  * {
    box-sizing: border-box;
  }

  &:hover {
    border: 1px solid var(--panel-border-hover-color);
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1rem;
    z-index: 10;

    div.post-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      height: 1.2rem;
      margin-bottom: 0.6rem;

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
    position: relative;
    width: 100%;
    min-height: 200px;
    padding: 1rem 1rem;
    z-index: 1;

    p {
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 400;
      line-height: 1.4em;
      opacity: 0.8;
      color: var(--text-color);
    }

    .fade {
      display: none;
    }

    .text-body {
      display: none;
    }
  }

  footer {
    display: grid;
    grid-template-columns: 1fr 0.2fr;
    width: 100%;
    height: auto;
    padding: 0.8rem 1rem;
    padding-bottom: 1rem;
    border-top: 1px solid var(--panel-border-color);
    z-index: 10;

    .interaction-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 1.3rem;
      opacity: 0.6;
      user-select: none;

      svg {
        width: 1.3rem;
        height: 1.3rem;
        position: absolute;
        top: 0rem;
        left: 0rem;
        fill: var(--text-color);
      }

      div {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: auto;
        height: 100%;
        margin-right: 8%;

        p {
          font-size: 0.8rem;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          color: var(--text-color);
          letter-spacing: 0.05em;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;

          margin-left: 1.5rem;
          padding-left: 0.35rem;
        }
      }
    }
  }
}

.post.rising {
  background-color: var(--panel-color-dark-rising);
  border: 1px solid var(--panel-border-dark-rising);

  &:hover {
    border: 1px solid var(--panel-border-hover-color);
  }
}

//--Text Post------------------------------------
//
.post {
  &.text {
    section.body {
      min-height: 0rem;
      max-height: 300px;
      padding: 0.8rem 1rem;
      overflow-y: hidden;
      background-color: transparent;

      .text-body {
        display: block;
      }

      p {
        opacity: 0.6;
        margin: 1em 0em;

        &:first-child {
          margin-top: 0em;
        }

        &:last-child {
          margin-bottom: 0em;
        }
      }

      .fade {
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10rem;
        background: linear-gradient(180deg, rgba(255,255,255,0) 0%, var(--panel-color) 100%);
      }
    }

    footer {
      padding-top: 1.5rem;
      border-top: none;
    }
  }

  &.text.short {
    section.body {
      .text-body {
        p {
          &:last-child {
            margin-bottom: 1em;
          }
        }
      }

      .fade {
        display: none;
      }
    }

    footer {
      padding-top: 1.5rem;
      border-top: 1px solid var(--panel-border-color);
    }
  }
}

//--Media Post-----------------------------------
//
.post {
  &.media {
    header {
      border-bottom: 1px solid var(--panel-border-color);
    }

    section.body {
      background-color: rgba(0, 0, 0, 0.25);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>