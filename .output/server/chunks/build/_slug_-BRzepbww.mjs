import { useSSRContext, defineComponent, ref, watch, mergeProps, unref, computed, withAsyncContext, onUnmounted } from 'vue';
import { _ as _export_sfc, c as useAuth, d as useRoute, e as useState } from './server.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { b as branchExists } from './branch-kN7sHKpR.mjs';
import { u as useLazyFetch } from './fetch-CcPjIrR6.mjs';
import { a as regexDisplayId } from './filterName-DJNXPkgF.mjs';
import '../routes/api/user/get-id.get.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'pg';
import 'dotenv';
import 'sharp';
import 'node:fs';
import 'node:url';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const editBranchActivePage = () => useState("editBranchActivePage", () => "general");
const backgroundImageModalEnabled = () => useState("backgroundImageModalEnabled", () => false);
const avatarImageModalEnabled = () => useState("avatarImageModalEnabled", () => false);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "navpanel",
  __ssrInlineRender: true,
  setup(__props) {
    const generalPageButton = ref(null);
    const pagesPageButton = ref(null);
    watch(editBranchActivePage, (val) => {
      if (val.value === "general") {
        generalPageButton.value.classList.add("active");
        pagesPageButton.value.classList.remove("active");
      } else if (val.value === "page") {
        generalPageButton.value.classList.remove("active");
        pagesPageButton.value.classList.add("active");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "edit-navpanel" }, _attrs))}><nav><ul><li><button class="active"><h3>General</h3></button></li><li><button class=""><h3>Pages</h3></button></li></ul></nav></section>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/edit/branches/navpanel.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "head",
  __ssrInlineRender: true,
  props: ["branchData"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_EditBranchesNavpanel = _sfc_main$6;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "head" }, _attrs))} data-v-732f1e8c><div class="introduction" data-v-732f1e8c><div class="text" data-v-732f1e8c><h1 class="title" data-v-732f1e8c>Editing</h1><h2 class="title" data-v-732f1e8c>b/${ssrInterpolate(__props.branchData.branch.branch_name)}</h2></div><div class="icon" data-v-732f1e8c><div class="container" data-v-732f1e8c><button class="disabled" data-v-732f1e8c>Save</button></div></div></div>`);
      _push(ssrRenderComponent(_component_EditBranchesNavpanel, null, null, _parent));
      _push(`</header>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/edit/branches/head.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-732f1e8c"]]);
const _sfc_main$4 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "pending" }, _attrs))} data-v-970cfb49><div class="introduction" data-v-970cfb49><h1 class="pending-large" data-v-970cfb49></h1></div><div class="edit-navpanel" data-v-970cfb49><nav data-v-970cfb49><ul data-v-970cfb49><li data-v-970cfb49><button class="active" data-v-970cfb49><p class="pending" data-v-970cfb49></p></button></li><li data-v-970cfb49><button data-v-970cfb49><p class="pending" data-v-970cfb49></p></button></li></ul></nav></div></section>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/edit/branches/head-pending.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-970cfb49"]]);
const maxBranchTitleCharacters = 60;
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "general",
  __ssrInlineRender: true,
  props: ["branchData"],
  setup(__props) {
    const props = __props;
    const branchName = ref(null);
    const branchCharactersRemaining = ref(21);
    watch(branchName, (value) => {
      branchCharactersRemaining.value = 21 - value.length;
      branchName.value = value.replace(/\s/g, "");
      if (value.length > 21) {
        branchName.value = value.slice(0, 21);
      }
      branchExists(value).then((res) => {
        if (res) {
          if (value === props.branchData.branch.branch_name) {
            branchNameTooltip.value.classList.remove("error");
            branchNameTooltip.value.innerHTML = "Characters remaining: <span>" + branchCharactersRemaining.value + "</span>";
            return;
          }
          branchNameTooltip.value.classList.add("error");
          branchNameTooltip.value.innerHTML = "Branch name already exists";
        } else {
          branchNameTooltip.value.classList.remove("error");
          branchNameTooltip.value.innerHTML = "Characters remaining: <span>" + branchCharactersRemaining.value + "</span>";
        }
      });
    });
    const branchNameTooltip = ref(null);
    const branchTitle = ref(null);
    const branchTitleCharactersRemaining = ref(maxBranchTitleCharacters);
    watch(branchTitle, (value) => {
      branchTitleCharactersRemaining.value = maxBranchTitleCharacters - value.length;
      branchTitle.value = value.replace(/\s\s/g, " ");
      if (value.length > maxBranchTitleCharacters) {
        branchTitle.value = value.slice(0, maxBranchTitleCharacters);
      }
    });
    ref(null);
    const branchTags = ref(null);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "page general" }, _attrs))} data-v-00bdc499><h3 data-v-00bdc499>General branch info</h3><div class="name-avatar" data-v-00bdc499><div class="name-privacy" data-v-00bdc499><div class="name" data-v-00bdc499><label data-v-00bdc499> Branch name <p class="placeholder" data-v-00bdc499>b/</p><div class="tooltip" title="Branch names can only contain numbers, letters, and hyphens. Name must be between 1-21 chars." data-v-00bdc499><svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-00bdc499><path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" data-v-00bdc499></path></svg></div></label><input type="text"${ssrRenderAttr("value", unref(branchName))} placeholder="" data-v-00bdc499><p class="message" data-v-00bdc499>Characters remaining: <span data-v-00bdc499>${ssrInterpolate(unref(branchCharactersRemaining))}</span></p></div><div class="privacy" data-v-00bdc499><label data-v-00bdc499> Privacy setting <div class="tooltip" title="Adjust the privacy of your branch to determine how people are able to find and interact with your community." data-v-00bdc499><svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-00bdc499><path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" data-v-00bdc499></path></svg></div></label><select data-v-00bdc499><option value="public" data-v-00bdc499>Public</option><option value="secret" data-v-00bdc499>Secret</option></select></div></div><div class="avatar" data-v-00bdc499><div class="container" data-v-00bdc499><svg class="edit-svg" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-00bdc499><path d="M794 390 666 262l42-42q17-17 42.5-16.5T793 221l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Z" data-v-00bdc499></path></svg><img${ssrRenderAttr("src", __props.branchData.branch.icon_image)} data-v-00bdc499></div></div><div class="title" data-v-00bdc499><label data-v-00bdc499> Branch title <div class="tooltip" title="Branch titles are displayed on your branch page and during searches. Titles are used to give your visitors more information about your page or expand on the name of your branch." data-v-00bdc499><svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-00bdc499><path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" data-v-00bdc499></path></svg></div></label><input type="text"${ssrRenderAttr("value", unref(branchTitle))} placeholder="Branch title" data-v-00bdc499><p class="message" data-v-00bdc499>Characters remaining: <span data-v-00bdc499>${ssrInterpolate(unref(branchTitleCharactersRemaining))}</span></p></div></div><div class="background-description" data-v-00bdc499><div class="background" data-v-00bdc499><label data-v-00bdc499> Background image <div class="tooltip" title="Branch backgrounds are displayed on your branch page and add help some flare to your community." data-v-00bdc499><svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-00bdc499><path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" data-v-00bdc499></path></svg></div></label><div class="container" data-v-00bdc499><svg class="edit-svg" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-00bdc499><path d="M794 390 666 262l42-42q17-17 42.5-16.5T793 221l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Z" data-v-00bdc499></path></svg><img class="background-img"${ssrRenderAttr("src", __props.branchData.branch.background_image)} data-v-00bdc499></div></div><div class="description" data-v-00bdc499><label data-v-00bdc499> Branch description <div class="tooltip" title="Descriptions are displayed on your branch page and help people find your community during searches. Descriptions are used to describe the content and purpose of your branch." data-v-00bdc499><svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-00bdc499><path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" data-v-00bdc499></path></svg></div></label><textarea placeholder="Branch description" data-v-00bdc499></textarea></div><div class="tags" data-v-00bdc499><label data-v-00bdc499> Branch Tags <div class="tooltip" title="Tags are a great way to increase your branches visibility and help people find your community during searches." data-v-00bdc499><svg class="more-info" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-00bdc499><path d="M453 776h60V536h-60v240Zm26.982-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" data-v-00bdc499></path></svg></div></label><input text="text"${ssrRenderAttr("value", unref(branchTags))} placeholder="Branch tags" data-v-00bdc499></div></div></form>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/edit/branches/page/general.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-00bdc499"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "background-image",
  __ssrInlineRender: true,
  props: ["branchData"],
  setup(__props) {
    const modal = ref(null);
    const openUploadPage = ref(true);
    const openLinkPage = ref(false);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(false);
    ref(null);
    const saveBackground = ref(null);
    const canSave = ref(false);
    watch(canSave, (value) => {
      if (value) {
        saveBackground.value.classList.remove("disabled");
      } else {
        saveBackground.value.classList.add("disabled");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "modal",
        ref_key: "modal",
        ref: modal
      }, _attrs))} data-v-f5d490d7><div class="panel" data-v-f5d490d7><div class="info" data-v-f5d490d7><h3 data-v-f5d490d7>Background Image</h3><button class="close-button" data-v-f5d490d7><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-f5d490d7><path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" data-v-f5d490d7></path></svg></button></div><div class="content" data-v-f5d490d7><div class="preview" data-v-f5d490d7><label for="previewImage" data-v-f5d490d7>Preview</label><div class="container" data-v-f5d490d7><img id="previewImage"${ssrRenderAttr("src", __props.branchData.branch.background_image)} data-v-f5d490d7></div></div><div class="navbar" data-v-f5d490d7><nav data-v-f5d490d7><ul data-v-f5d490d7><li data-v-f5d490d7><button class="active" data-v-f5d490d7>Upload image</button></li></ul></nav></div><div class="sub-pages" data-v-f5d490d7><div style="${ssrRenderStyle(unref(openUploadPage) ? null : { display: "none" })}" class="upload-option" data-v-f5d490d7><div class="upload" data-v-f5d490d7><label for="backgroundImage" data-v-f5d490d7>Click or drag an image here</label><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-f5d490d7><path d="M220 896q-24 0-42-18t-18-42V693h60v143h520V693h60v143q0 24-18 42t-42 18H220Zm230-153V372L330 492l-43-43 193-193 193 193-43 43-120-120v371h-60Z" data-v-f5d490d7></path></svg><input type="file" id="backgroundImage" name="background-image" accept="image/*" data-v-f5d490d7></div></div><div style="${ssrRenderStyle(unref(openLinkPage) ? null : { display: "none" })}" class="link-option" data-v-f5d490d7></div></div><div class="actions" data-v-f5d490d7><button class="save disabled" data-v-f5d490d7>Save</button></div></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/edit/branches/modal/background-image.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f5d490d7"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "avatar-image",
  __ssrInlineRender: true,
  props: ["branchData"],
  setup(__props) {
    const modal = ref(null);
    const openUploadPage = ref(true);
    const openLinkPage = ref(false);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(false);
    ref(null);
    const saveAvatar = ref(null);
    const canSave = ref(false);
    watch(canSave, (value) => {
      if (value) {
        saveAvatar.value.classList.remove("disabled");
      } else {
        saveAvatar.value.classList.add("disabled");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "modal",
        ref_key: "modal",
        ref: modal
      }, _attrs))} data-v-9b8e931d><div class="panel" data-v-9b8e931d><div class="info" data-v-9b8e931d><h3 data-v-9b8e931d>Avatar Image</h3><button class="close-button" data-v-9b8e931d><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-9b8e931d><path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" data-v-9b8e931d></path></svg></button></div><div class="content" data-v-9b8e931d><div class="preview" data-v-9b8e931d><div class="container" data-v-9b8e931d><img id="previewImage"${ssrRenderAttr("src", __props.branchData.branch.background_image)} data-v-9b8e931d></div></div><div class="navbar" data-v-9b8e931d><nav data-v-9b8e931d><ul data-v-9b8e931d><li data-v-9b8e931d><button class="active" data-v-9b8e931d>Upload image</button></li></ul></nav></div><div class="sub-pages" data-v-9b8e931d><div style="${ssrRenderStyle(unref(openUploadPage) ? null : { display: "none" })}" class="upload-option" data-v-9b8e931d><div class="upload" data-v-9b8e931d><label for="avatarImage" data-v-9b8e931d>Click or drag an image here</label><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-9b8e931d><path d="M220 896q-24 0-42-18t-18-42V693h60v143h520V693h60v143q0 24-18 42t-42 18H220Zm230-153V372L330 492l-43-43 193-193 193 193-43 43-120-120v371h-60Z" data-v-9b8e931d></path></svg><input type="file" id="avatarImage" name="background-image" accept="image/*" data-v-9b8e931d></div></div><div style="${ssrRenderStyle(unref(openLinkPage) ? null : { display: "none" })}" class="link-option" data-v-9b8e931d></div></div><div class="actions" data-v-9b8e931d><button class="save disabled" data-v-9b8e931d>Save</button></div></div></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/edit/branches/modal/avatar-image.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9b8e931d"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { status, data } = useAuth();
    const { slug } = useRoute().params;
    const authorised = ref(false);
    const branchExists2 = ref(false);
    const canViewPage = computed(() => {
      return authorised.value && branchExists2.value;
    });
    const { data: branchData, pending } = ([__temp, __restore] = withAsyncContext(() => useLazyFetch(`/api/branches/get/branch?name=${slug}`, "$zZTueiKkcl")), __temp = await __temp, __restore(), __temp);
    checkIsAuthorised();
    watch(branchData, (val) => {
      checkIsAuthorised();
    });
    function checkIsAuthorised() {
      if (branchData.value === null) {
        console.log("Branch does not exist");
        branchExists2.value = false;
      } else {
        branchExists2.value = true;
        if (status.value !== "authenticated") {
          console.log("You are not logged in");
          authorised.value = false;
        }
        const owner_id = branchData.value.branch.owner_user_id;
        if (owner_id !== regexDisplayId(data)) {
          console.log("You are not authorised to view this page");
          authorised.value = false;
        } else {
          console.log("You are authorised to view this page");
          authorised.value = true;
        }
      }
    }
    watch(backgroundImageModalEnabled(), (val) => {
      toggleFixedBody(val);
    });
    watch(avatarImageModalEnabled(), (val) => {
      toggleFixedBody(val);
    });
    function toggleFixedBody(val) {
      const scrollYAbsolute = (void 0).scrollY;
      if (val === true) {
        (void 0).body.style.position = "fixed";
        (void 0).body.style.top = `-${scrollYAbsolute}px`;
      } else {
        const scrollY = (void 0).body.style.top;
        (void 0).body.style.position = "";
        (void 0).body.style.top = "";
        (void 0).scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    function disableActiveModals() {
      if (backgroundImageModalEnabled().value === true) {
        backgroundImageModalEnabled().value = false;
      }
    }
    onUnmounted(() => {
      disableActiveModals();
      editBranchActivePage().value = "general";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_EditBranchesHead = __nuxt_component_0;
      const _component_EditBranchesHeadPending = __nuxt_component_1;
      const _component_EditBranchesPageGeneral = __nuxt_component_2;
      const _component_EditBranchesModalBackgroundImage = __nuxt_component_3;
      const _component_EditBranchesModalAvatarImage = __nuxt_component_4;
      _push(`<!--[-->`);
      if (unref(canViewPage)) {
        _push(ssrRenderComponent(_component_EditBranchesHead, { branchData: unref(branchData) }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_EditBranchesHeadPending, null, null, _parent));
      }
      if (unref(canViewPage)) {
        _push(`<div class="pages" data-v-617eecaf>`);
        _push(ssrRenderComponent(_component_EditBranchesPageGeneral, {
          style: ("editBranchActivePage" in _ctx ? _ctx.editBranchActivePage : unref(editBranchActivePage))().value === "general" ? null : { display: "none" },
          branchData: unref(branchData)
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<section class="pages" data-v-617eecaf></section>`);
      }
      if (("backgroundImageModalEnabled" in _ctx ? _ctx.backgroundImageModalEnabled : unref(backgroundImageModalEnabled))().value) {
        _push(ssrRenderComponent(_component_EditBranchesModalBackgroundImage, { branchData: unref(branchData) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (("avatarImageModalEnabled" in _ctx ? _ctx.avatarImageModalEnabled : unref(avatarImageModalEnabled))().value) {
        _push(ssrRenderComponent(_component_EditBranchesModalAvatarImage, { branchData: unref(branchData) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/edit/b/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-617eecaf"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-BRzepbww.mjs.map
