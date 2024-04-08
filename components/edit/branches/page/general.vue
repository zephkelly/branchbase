<template>
  <form class="page general">
    <h3>General branch info</h3>
    <div class="name-avatar">
      <div class="name-privacy">
        <div class="name">
          <label>
            Branch name
            <p class="placeholder">b/</p>
            <div class="tooltip" title="Branch names can only contain numbers, letters, and hyphens. Name must be between 1-21 chars.">
              <svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                <path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/>
              </svg>
            </div>
          </label>
          <input type="text" ref="branchNameRef" v-model="branchName" placeholder="" @focusin="showBranchNameMessage()" @focusout="hideBranchNameMessage()">
          <p class="message" ref="branchNameTooltip">Characters remaining: <span>{{ branchCharactersRemaining }}</span></p>
        </div>
        <div class="privacy">
          <label>
            Privacy setting
            <div class="tooltip" title="Adjust the privacy of your branch to determine how people are able to find and interact with your community.">
              <svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                <path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/>
              </svg>
            </div>
          </label>
          <select >
            <option value="public">Public</option>
            <option value="secret">Secret</option>
          </select>
        </div>
      </div>
      <div class="avatar">
        <div class="container" @click="openAvatarModal()">
          <svg class="edit-svg" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M794 390 666 262l42-42q17-17 42.5-16.5T793 221l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Z"/></svg>
          <img :src="branchData.branch.icon_image">
        </div>
      </div>
      <div class="title">
        <label>
          Branch title
          <div class="tooltip" title="Branch titles are displayed on your branch page and during searches. Titles are used to give your visitors more information about your page or expand on the name of your branch.">
            <svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
              <path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/>
            </svg>
          </div>
        </label>
        <input type="text" ref="branchTitleRef" v-model="branchTitle" placeholder="Branch title" @focusin="showBranchTitleMessage()" @focusout="hideBranchTitleMessage()">
        <p class="message" ref="branchTitleTooltip">Characters remaining: <span>{{ branchTitleCharactersRemaining }}</span></p>
      </div>
    </div>
    <div class="background-description">
      <div class="background">
        <label>
          Background image
          <div class="tooltip" title="Branch backgrounds are displayed on your branch page and add help some flare to your community.">
            <svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
              <path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/>
            </svg>
          </div>
        </label>
        <div class="container" @click="openBackgroundModal()">
          <svg class="edit-svg" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M794 390 666 262l42-42q17-17 42.5-16.5T793 221l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Z"/></svg>
          <img class="background-img" :src="branchBackgroundImage">
        </div>
      </div>
      <div class="description">
        <label>
          Branch description
          <div class="tooltip" title="Descriptions are displayed on your branch page and help people find your community during searches. Descriptions are used to describe the content and purpose of your branch.">
            <svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
              <path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/>
            </svg>
          </div>
        </label>
        <textarea placeholder="Branch description"></textarea>
      </div>
      <div class="tags">
        <label>
          Branch Tags
          <div class="tooltip" title="Tags are a great way to increase your branches visibility and help people find your community during searches.">
            <svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
              <path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/>
            </svg>
          </div>
        </label>
        <input text="text" ref="branchTagsRef" v-model="branchTags" placeholder="Branch tags">
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { branchExists } from '@/utils/fetch/branch';
const props = defineProps(['branchData'])

// -------------- Branch name ------------------
const branchName: Ref = ref(null);

//Count branch name characters
const branchCharactersRemaining: Ref = ref(21);
watch(branchName, (value) => {
  branchCharactersRemaining.value = 21 - value.length;

  branchName.value = value.replace(/\s/g, '');

  if (value.length > 21) {
    branchName.value = value.slice(0, 21);
  }

  branchExists(value).then((res) => {
    if (res) {
      if (value === props.branchData.branch.branch_name) {
        branchNameTooltip.value.classList.remove('error');
        branchNameTooltip.value.innerHTML = 'Characters remaining: <span>' + branchCharactersRemaining.value + '</span>';
        return;
      }
      branchNameTooltip.value.classList.add('error');
      branchNameTooltip.value.innerHTML = 'Branch name already exists';
    } else {
      branchNameTooltip.value.classList.remove('error');
      branchNameTooltip.value.innerHTML = 'Characters remaining: <span>' + branchCharactersRemaining.value + '</span>';
    }
  });
});

//Show branch name tooltip on focus
let timeoutName: any = null;
const branchNameTooltip: Ref = ref(null);
const showBranchNameMessage = () => {
  clearTimeout(timeoutName);
  branchNameTooltip.value.classList.add('active');
}
const hideBranchNameMessage = () => {
  timeoutName = setTimeout(() => {
    branchNameTooltip.value.classList.remove('active');
  }, 2000);
}

// -------------- Branch Avatar -----------------
function openAvatarModal() {
  avatarImageModalEnabled().value = true;
}

// -------------- Branch title ------------------
const branchTitle: Ref = ref(null);

//Count branch title characters
const maxBranchTitleCharacters = 60;
const branchTitleCharactersRemaining: Ref = ref(maxBranchTitleCharacters);
watch(branchTitle, (value) => {
  branchTitleCharactersRemaining.value = maxBranchTitleCharacters - value.length;

  //If there are two spaces in a row replace them with one
  branchTitle.value = value.replace(/\s\s/g, ' ');

  if (value.length > maxBranchTitleCharacters) {
    branchTitle.value = value.slice(0, maxBranchTitleCharacters);
  }
});

let timeoutToolip: any = null;
const branchTitleTooltip: Ref = ref(null);
const showBranchTitleMessage = () => {
  clearTimeout(timeoutToolip);
  branchTitleTooltip.value.classList.add('active');
}
const hideBranchTitleMessage = () => {
  timeoutToolip = setTimeout(() => {
    branchTitleTooltip.value.classList.remove('active');
  }, 2000);
}

// -------------- Branch description ------------------

// -------------- Branch background -------------------
const branchBackgroundImage: Ref = ref(null);

function openBackgroundModal() {
  backgroundImageModalEnabled().value = true;
}

// -------------- Branch tags ------------------
const branchTags: Ref = ref(null);


// -------------- Mounted ------------------
const branchNameRef: Ref = ref(null);
const branchTitleRef: Ref = ref(null);
onMounted(() => {
  branchName.value = props.branchData.branch.branch_name;
  branchTitle.value = props.branchData.branch.branch_title;
  branchNameRef.value.placeholder = props.branchData.branch.branch_name;
  branchTitleRef.value.placeholder = props.branchData.branch.branch_title;
  branchBackgroundImage.value = props.branchData.branch.background_image;
});

watch(backgroundImageModalEnabled(), async (value) => {
    const { data: branchData } = await useFetch(`/api/branches/get/branch?name=${props.branchData.branch.branch_name}`);
    
    //@ts-expect-error
    branchBackgroundImage.value = branchData.value?.branch.background_image;
});
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
    margin-top: 5rem;

    &:first-of-type {
      margin-top: 0;
    }
  }

  label {
    position: relative;
    margin-bottom: 0.35em;
    width: auto;
  }

  input, textarea {
    &::placeholder {
      opacity: 0.4;
    }
  }

  p {
    &.placeholder {
      opacity: 0.45;
    }

    &.message {
      color: var(--text-color-darker);
      font-size: 0.8rem;
      margin-top: 0.5em;
      opacity: 0;
      transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);

      &.active {
        opacity: 0.6;
      }

      span {
        font-weight: 500;
      }

      &.error {
        display: block;
        color: red;
      }
    }
  }

  .more-info {
    position: absolute;
    top: 0rem;
    right: -1.45rem;
    width: 1rem;
    height: 1rem;
    fill: var(--text-color-darker);
    opacity: 0.6;
    cursor: pointer;
    z-index: 1;
  }
}

.name-avatar {
  position: relative;
  margin-bottom: 1rem;
  grid-template-columns: 1fr 170px;

  .name-privacy {
    height: 5rem;
    grid-template-columns: 1fr 1fr;

    .name {
      input {
        padding-left: 2.08rem;
        width: 11rem;
        margin-top: 0.35em;
      }
  
      p {
        &.placeholder {
          color: var(--text-color-darker);
          top: 2.1rem;
          left: 0.9rem;
          position: absolute;
          letter-spacing: 0.08rem;
          font-size: 1rem;
          z-index: 10;
        }
      }

      .more-info {
        top: 0.08rem;
        right: -1.58rem;
      }
    }

    .privacy {
      select {
        margin-top: 0.35em;
        padding: 0.54rem;
        padding-left: 0.8rem;
        width: 10rem;
      }

      .more-info {
        top: 0.08rem;
      }
    }
  }
}

.avatar {
  justify-content: flex-end;
  height: 5rem;
  
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 10.5rem;
    height: 10.5rem;
    border-radius: 50%;
    border: 1px solid var(--panel-border-color);
    cursor: pointer;

    svg {
      position: absolute;
      fill: var(--text-color);
      transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
      opacity: 0;
      z-index: 10;
    }

    img {
      width: 10.5rem;
      height: 10.5rem;
      object-fit: cover;
      transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    &:hover {
      svg {
        opacity: 1;
      }

      img {
        opacity: 0.4;
      }
    }
  }
}

.title {
  grid-column: 1 / 3;
  margin-top: 2rem;
  margin-bottom: 1.5rem;

  label {
    width: 5.3rem;
  }

  input {
    width: 28rem;
  }
}

.background-description {
  .background {
    max-width: 700px;
    margin-bottom: 3.8rem;

    label {
      width: 8.5rem;
    }

    .container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 700px;
      max-width: 700px;
      height: 100%;
      max-height: 145px;
      min-height: 145px;
      border-radius: 0.5rem;
      border: 1px solid var(--panel-border-color);
      cursor: pointer;

      svg {
        fill: var(--text-color);
        position: absolute;
        opacity: 0;
        transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
      }

      .background-img {
        max-width: 100%;
        max-width: 700px;
        height: auto;
        max-height: 150px;
        object-fit: cover;
        border-radius: 0.5rem;
        transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
      }
    }

    .container:hover {
      .background-img {
        opacity: 0.4;
      }

      svg {
        z-index: 10;
        opacity: 1;
      }
    }
  }
}

.description {
  grid-column: 1 / 3;
  margin-bottom: 3.8rem;

  label {
    width: 8.5rem;
  }

  textarea {
    height: 3.9rem;
    resize: none;
  }
}

.tags {
  label {
    width: 5.65rem;
  }
}
</style>
