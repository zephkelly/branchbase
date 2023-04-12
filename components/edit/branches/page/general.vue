<template>
  <form class="page general">
    <h3>Name and avatar</h3>
    <div class="name-avatar">
      <div class="name">
        <label>
          Branch name
          <p class="placeholder">b/</p>
          <div class="tooltip" title="Branch names can only contain numbers, letters, and hyphens. Name must be between 1-21 chars.">
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
              <path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/>
            </svg>
          </div>
        </label>
        <input type="text" v-model="branchName" placeholder="" @focusin="showBranchNameTooltip()" @focusout="hideBranchNameTooltip()">
        <p class="message" ref="branchNameTooltip">Characters remaining: <span>{{ branchCharactersRemaining }}</span></p>
      </div>
      <div class="avatar">
        <div class="container">
          <img :src="props.branchData.branch.icon_image">
        </div>
      </div>
      <div class="title">
        <label>
          Branch title
        </label>
        <input type="text" v-model="branchTitle" placeholder="Branch title">
      </div>
    </div>
    <h3>Description and metadata</h3>
    <div class="description-metadata">
      <div class="description">
        <label>
          Branch description
        </label>
        <textarea placeholder="Branch description"></textarea>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
const props = defineProps(['branchData'])

// -------------- Branch name ------------------
const branchName: Ref = ref(null);
const branchNameTooltip: Ref = ref(null);
branchName.value = props.branchData.branch.branch_name;

//Count branch name characters
const branchCharactersRemaining: Ref = ref(21);
watch(branchName, (value) => {
  branchCharactersRemaining.value = 21 - value.length;

  if (value.length > 21) {
    branchName.value = value.slice(0, 21);
  }
});

//Show branch name tooltip on focus
// timeout variable to hold the timeout, if it needs to be cancelled
let timeout: any = null;
const showBranchNameTooltip = () => {
  clearTimeout(timeout);
  branchNameTooltip.value.classList.add('active');
}
const hideBranchNameTooltip = () => {
  timeout = setTimeout(() => {
    branchNameTooltip.value.classList.remove('active');
  }, 2000);
}

// -------------- Branch title ------------------
const branchTitle: Ref = ref(null);
branchTitle.value = props.branchData.branchMeta.branch_title;
</script>

<style lang="scss" scoped>
form {
  > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    
    > div {
      display: grid;
      flex-direction: column;
    }
  }

  h3 {
    font-size: 1.8rem;
    border-bottom: 1px solid var(--panel-border-color);
    padding-bottom: 0.4rem;
    margin-bottom: 1.5rem;
    margin-top: 6rem;

    &:first-of-type {
      margin-top: 0;
    }
  }

  label {
    position: relative;
    margin-bottom: 0.35em;
  }

  p {
    &.message {
      color: var(--text-color-darker);
      opacity: 0.6;
      font-size: 0.8rem;
      margin-top: 0.5em;

      span {
        font-weight: 500;
      }

      &.error {
        color: red;
      }
    }
  }

}

.name-avatar {
  position: relative;
  margin-bottom: 1rem;

  .name {
    height: 5rem;

    input {
      padding-left: 2.08rem;
      width: 11rem;
    }

    p {
      &.placeholder {
        color: var(--text-color-darker);
        opacity: 0.6;
        top: 2.1rem;
        left: 0.9rem;
        position: absolute;
        letter-spacing: 0.08rem;
        font-size: 1rem;
        z-index: 10;
      }

      &.message {
        opacity: 0;
        transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
        
        &.active {
          opacity: 0.6;
        }
      }

      &.error {
        display: block;
      }
    }

    svg {
      position: absolute;
      top: 0rem;
      left: 6.2rem;
      width: 1rem;
      height: 1rem;
      fill: var(--text-color-darker);
      opacity: 0.6;
      cursor: pointer;
      z-index: 10;
    }
  }
}

.avatar {
  justify-content: flex-end;
  height: 5rem;
  
  .container {
    overflow: hidden;
    width: 10.5rem;
    height: 10.5rem;
    border-radius: 50%;
    border: 1px solid var(--panel-border-color);
  }

  img {
    width: 10.5rem;
    height: 10.5rem;
  }
}

.title {
  grid-column: 1 / 3;
  margin-top: 2rem;
  margin-bottom: 1.5rem;

  input {
    width: 28rem;
  }
}

.description {
  grid-column: 1 / 3;

  textarea {
    height: 3.9rem;
    resize: none;
  }
}
</style>
