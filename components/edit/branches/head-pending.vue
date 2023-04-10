<template>
  <section class="pending">
    <div class="introduction">
      <h1 class="pending-large"></h1>
      <p class="pending"></p>
    </div>
    <div class="edit-branch-navbar">
      <nav>
        <ul>
          <li>
            <button class="active">
              <p class="pending"></p>
            </button>
          </li>
          <li>
            <button>
              <p class="pending"></p>
            </button>
          </li>
          <li>
            <button>
              <p class="pending"></p>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section.pending {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  background-color: var(--panel-color);
  border-bottom: 1px solid var(--panel-border-color);
  box-sizing: border-box;
  width: 100%;

  * {
    box-sizing: border-box;
  }

 div {
  width: 700px;
  height: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  // padding-top: 3rem;

  &.introduction {
    h1 {
     width: 16rem;
     height: 2rem;
    }
 
    p {
     width: 10rem;
     height: 1.3rem;
     margin-top: 0.3em;
    }
  }

  &.edit-branch-navbar {
    position: relative;
    top: 1px;
    
    li {
      button {
        border-bottom: 1px solid var(--panel-border-color);
  
        p {
          min-height: 1.2rem;
          min-width: 5rem;
          animation-duration: 4s;
        }
      }

      &:first-of-type {
        p {
          animation-delay: 1.5s;
          min-width: 3.8rem;
        }
      }

      &:last-of-type {
        p {
          animation-delay: 2s;
          min-width: 3.6rem;
        }
      }
    }

    button.active {
      border-bottom: none;
    }
  }
 }
}
</style>