<template>
  <section class="pending">
    <div class="introduction">
      <h1 class="pending-large"></h1>
    </div>
    <div class="edit-navpanel">
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
  padding-top: 3rem;
  background-color: var(--panel-color);
  border-bottom: 1px solid var(--panel-border-color);
  box-sizing: border-box;
  width: 100%;

  * {
    box-sizing: border-box;
  }

 div {
  width: 700px;
  height: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  &.introduction {
    h1 {
     width: 16rem;
     height: 2.2rem;
    }
  }

  &.edit-navpanel {
    height: 6rem;
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
          min-width: 3.7rem;
        }
      }

      &:last-of-type {
        p {
          animation-delay: 2s;
          min-width: 2.8rem;
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