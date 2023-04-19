<template>
  <Transition name="fade">
    <div v-show="isCreatingIndex().value" class="create-panel">
      <nav class="options">
        <ul>
          <li>
            <button class="create-post active" @click="isCreatePost = true" ref="createBranch" alt="Create a post" title="Create a post">
              <h3 class="title">Create a post</h3>
            </button>
          </li>
          <li>
            <button class="create-post inactive" @click="isCreatePost = false" ref="createPost" alt="Create a branch" title="Create a branch">
              <h3 class="title">Create a branch</h3>
            </button>
          </li>
          <li>

          </li>
          <li>
            <button class="close" @click="isCreatingIndex().value = false, toggleFeedMenu().value = false" alt="Close" title="Close create panel">
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
            </button>
          </li>
        </ul>
      </nav>
      <section class="content">
        <Transition name="fade2">
          <form v-if="isCreatePost" class="create-post">
            <div class="title">
              <h3>Post title</h3>
              <input type="text" placeholder="Title">
            </div>
            <div class="content">
              <h3>Content</h3>
              <textarea placeholder="Content"></textarea>
            </div>
            <div class="submit">
              <button class="submit" alt="Submit" title="Submit">
                <h3>Submit</h3>
              </button>
            </div>
          </form>
        </Transition>
        <Transition name="fade2">
          <form v-if="!isCreatePost" class="create-branch" ref="branchForm" @submit="$event.preventDefault()">
            <div class="field name container">
              <div>
                <label for="branch-name">Name your branch</label>
                <input id="branch-name" class="branch-name-input" v-model="branchInputModel" type="text" @input="canEnableSumbit()" required>
                <p class="placeholder">b/</p>
                <div class="tooltip">
                  <p class="tip" v-show="!branchNameTaken">Characters remaining: <span>{{ branchCharactersRemaining }}</span></p>
                  <p class="error" ref="nameError" v-show="branchNameTaken">Sorry, that name is already in use!</p>
                </div>
              </div>
              <div>
                <label for="branch-type">Set your branch visibility</label>
                <select id="branch-type" class="branch-type-input" v-model="branchTypeModel" @click="canEnableSumbit()" required>
                  <option value="public" title="Anybody can view the community" selected>Public</option>
                  <option value="secret" title="Anybody with a link or an invite can view the community">Secret</option>
                </select>
              </div>
            </div>
            <div class="field description">
              <label for="branch-description">Describe your branch</label>
              <textarea id="branch-description" class="branch-description-input" v-model="branchDescriptionModel" placeholder="Let people know what your community is all about" @input="canEnableSumbit()" required></textarea>
              <div class="tooltip">
                <p class="tip">Characters remaining: <span>{{ descriptionCharsRemaining }}</span></p>
                <p class="error" ref="descriptionError" v-show="false">Sorry, that description is too long!</p>
              </div>
            </div>
            <div class="field submit">
              <button class="submit disabled" alt="Submit" ref="submitBranchButton" @click="submitBranch()" title="Submit">
                <h3>Submit</h3>
              </button>
            </div>
          </form>
        </Transition>
      </section>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { branchExists } from '@/utils/fetch/branch';
import { validateBranchName } from '@/utils/branches/validation';

const { data } = useSession();

//are we creating a post or a branch?
const createPost: Ref = ref(null);
const createBranch: Ref = ref(null);
const isCreatePost = ref(true);
watch(isCreatePost, (value) => {
  if (value) {
    createPost.value?.classList.add('inactive');
    createPost.value?.classList.remove('active');
    createBranch.value?.classList.remove('inactive');
    createBranch.value?.classList.add('active');
  } else {
    createPost.value?.classList.remove('inactive');
    createPost.value?.classList.add('active');
    createBranch.value?.classList.add('inactive');
    createBranch.value?.classList.remove('active');
  }
});

//Count branch name characters
const branchCharactersRemaining: Ref = ref(21);
const branchInputModel: Ref = ref(null);
watch(branchInputModel, (value) => {
  branchNameTaken.value = false;
  branchCharactersRemaining.value = 21 - value.length;

  branchInputModel.value = validateBranchName(value);
});

//Does branch name exist?
const branchNameTaken: Ref = ref(false);
const branchNameTakenTimeout: Ref = ref(null);
watch(branchInputModel, (inputValue) => {
  if (branchNameTakenTimeout.value) {
    clearTimeout(branchNameTakenTimeout.value);
  }

  branchNameTakenTimeout.value = setTimeout(async () => {
    if (await branchExists(inputValue)) {
      branchNameTaken.value = true;
    } else {
      branchNameTaken.value = false;
    }
  }, 800);
});

//Count branch description characters
const maxDescriptionChars: number = 200;
const descriptionCharsRemaining: Ref = ref(maxDescriptionChars);
const branchDescriptionModel: Ref = ref(null);
watch(branchDescriptionModel, (value) => {
  descriptionCharsRemaining.value = maxDescriptionChars - value.length;

  if (value.length > maxDescriptionChars) {
    branchDescriptionModel.value = value.slice(0, maxDescriptionChars);
  }
});

//Watch can we submit
const branchForm: Ref = ref(null);
const branchTypeModel: Ref = ref(null);
const submitBranchButton: Ref = ref(null);
function canEnableSumbit() {
  if (branchForm.value?.checkValidity()) {
    submitBranchButton.value?.classList.remove('disabled');
  } else {
    submitBranchButton.value?.classList.add('disabled');
  }
}

//Watch submit button
async function submitBranch() {
  if (branchForm?.value?.checkValidity()) {
    const branchName = branchInputModel.value;
    const branchDescription = branchDescriptionModel.value;
    const branchType = branchTypeModel.value;

    const response = await useFetch('/api/branches/create', {
      method: 'POST',
      body: JSON.stringify({
        branch_name: branchName,
        branch_description: branchDescription,
        branch_type: branchType,
        user_email: data.value?.user?.email
      })
    });

    if (response.data.value?.success) {
      console.log("Branch created successfully!");
    } else {
      console.log("Branch creation failed!");
    }
  }
}
</script>

<!-- General styles -->
<style lang="scss" scoped>
.create-panel {
  position: absolute;
  top: 7.1rem;
  width: 100%;
  height: 30rem;
  border: 1px solid var(--panel-border-color);
  border-radius: 0.4rem;
  background-color: var(--panel-color);
  opacity: 1;
  box-sizing: border-box;
}

nav {
  position: relative;
  height: 3.5rem;

  ul {
    display: grid;
    grid-template-columns: 1fr 1fr 0.6fr 3.5rem;
    height: 100%;
  }

  li {
    height: 100%;
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: var(--panel-color);
      border: none;
      transition: background-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
      
      &:hover {
        background-color: var(--panel-hover-color);
      }

      h3 {
        color: var(--text-color);
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
      }
    }

    button.inactive {
      background-color: var(--panel-hover-color-inverted);
      border-bottom: 1px solid var(--panel-border-color);

      h3 {
        opacity: 0.4;
      }

      &:hover {
        background-color: var(--panel-hover-color);

        h3 {
          opacity: 1;
        }
      }
    }

    &:nth-child(1) button.active {
      border-radius: 0.4rem 0rem 0rem 0rem;
      border-right: 1px solid var(--panel-border-color);
    }

    &:nth-child(2) button.active {
      border-left: 1px solid var(--panel-border-color);
      border-right: 1px solid var(--panel-border-color);
    }

    &:nth-child(3){
      background-color: var(--panel-hover-color-inverted);
      border-bottom: 1px solid var(--panel-border-color);
      height: 3.48rem;
    }
  }

  button.close {
    position: absolute;
    justify-content: center;
    right: 0rem;
    height: 100%;
    width: 3.5rem;
    padding: 0rem;
    border-radius: 0rem 0.4rem 0rem 0rem;
    cursor: pointer;
    border-left: 1px solid var(--panel-border-color);
  
    svg {
      height: 48%;
      width: 48%;
      fill: var(--text-color);
    }
  }
}

section.content {
  height: 26.5rem;
  box-sizing: border-box;
  
  form {
    position: absolute;
    padding: 2rem;
    box-sizing: border-box;
    width: 100%;
    height: 26.5rem;

    label {
      color: var(--text-color);
      margin-bottom: 0.5em;
      font-size: 1rem;
    }

    .tooltip {
      height: 0.9rem;
      font-size: 0.8rem;
      margin-top: 0.5em;

      p {
        position: absolute;
        color: var(--text-color-darker);
        opacity: 0.6;

        &.error {
          font-size: 0.9rem;
          color: rgb(255, 0, 0);
        }
      }
    }

    .placeholder {
      position: absolute;
      letter-spacing: 0.08rem;
      font-size: 1rem;
    }
  }

  .field {
    position: relative;
    display: flex;
    flex-direction: column;
    font-family: 'Roboto', sans-serif;

    &.container {
      flex-direction: row;

      div {
        display: flex;
        flex-direction: column;
      }
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade2-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade2-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

<!-- Create branch panel -->
<style lang="scss" scoped>
form.create-branch {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.field.name {
  input {
    padding-left: 2.08rem;
  }

  p {
    &.placeholder {
      color: var(--text-color-darker);
      opacity: 0.6;
      top: 2.15rem;
      left: 0.9rem;
    }
  }
}

.field.container {
  height: 6rem;
  justify-content: space-between;
  align-items: flex-start;

  div:first-child {
    width: 17rem;
  }

  div:last-child {
    width: 12rem;
  }

  select {
    height: 2.3rem;
    width: 11rem;
    padding: 0rem 0.8rem;
    font-size: 0.95rem;
  }
}

.field.description {
  textarea {
    height: 4.6rem;
  }
  textarea::placeholder {
    color: var(--text-color-darker);
  }
  textarea::-webkit-input-placeholder {
    color: var(--text-color-darker);
  }
  textarea::-moz-placeholder {
    color: var(--text-color-darker);
  }
  textarea:-ms-input-placeholder {
    color: var(--text-color-darker);
  }
  textarea::-ms-input-placeholder {
    color: var(--text-color-darker);
  }
}

.field.submit {
  align-items: flex-end;
  margin-right: 0rem;

  button {
    border-radius: 1rem;
    width: 6rem;
    height: 2.5rem;
    font-size: 1rem;
  }
}
</style>