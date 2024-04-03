import { H as Head } from './components-Dnihj8JX.mjs';
import { u as useHead } from './index-BabADJUJ.mjs';
import { c as useAuth, _ as _export_sfc, e as useState } from './server.mjs';
import { useSSRContext, defineComponent, ref, withCtx, createVNode, unref, watch, mergeProps, createTextVNode, onUnmounted } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { i as isCreatingIndex, _ as __nuxt_component_0$1, a as _sfc_main$5 } from './post-CnQtPsHh.mjs';
import { b as branchExists } from './branch-kN7sHKpR.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-P6SDANQl.mjs';
import { u as useLazyFetch } from './fetch-CcPjIrR6.mjs';
import '@unhead/shared';
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
import 'vue-router';

function validateBranchName(value, returnBool = false) {
  let passedValiation = true;
  if (value.length > 21) {
    value = value.slice(0, 21);
    passedValiation = false;
  }
  if (value.includes(" ")) {
    value = value.replace(/\s/g, "");
    passedValiation = false;
  }
  if (value.match(/[^a-zA-Z0-9-]/g)) {
    value = value.replace(/[^a-zA-Z0-9-]/g, "");
    passedValiation = false;
  }
  if (value.match(/--/g)) {
    value = value.replace(/--/g, "-");
    passedValiation = false;
  }
  if (returnBool) {
    return passedValiation;
  } else {
    return value;
  }
}
const maxDescriptionChars = 200;
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "create-panel",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const createPost = ref(null);
    const createBranch = ref(null);
    const isCreatePost = ref(true);
    watch(isCreatePost, (value) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (value) {
        (_a = createPost.value) == null ? void 0 : _a.classList.add("inactive");
        (_b = createPost.value) == null ? void 0 : _b.classList.remove("active");
        (_c = createBranch.value) == null ? void 0 : _c.classList.remove("inactive");
        (_d = createBranch.value) == null ? void 0 : _d.classList.add("active");
      } else {
        (_e = createPost.value) == null ? void 0 : _e.classList.remove("inactive");
        (_f = createPost.value) == null ? void 0 : _f.classList.add("active");
        (_g = createBranch.value) == null ? void 0 : _g.classList.add("inactive");
        (_h = createBranch.value) == null ? void 0 : _h.classList.remove("active");
      }
    });
    const branchCharactersRemaining = ref(21);
    const branchInputModel = ref(null);
    watch(branchInputModel, (value) => {
      branchNameError.value = false;
      branchCharactersRemaining.value = 21 - value.length;
      branchInputModel.value = validateBranchName(value);
    });
    const nameError = ref("");
    const branchNameError = ref(false);
    const branchNameTakenTimeout = ref(null);
    watch(branchInputModel, (inputValue) => {
      if (branchNameTakenTimeout.value) {
        clearTimeout(branchNameTakenTimeout.value);
      }
      branchNameTakenTimeout.value = setTimeout(async () => {
        if (await branchExists(inputValue)) {
          console.log(await branchExists(inputValue));
          branchNameError.value = true;
          nameError.value = "Sorry, that name is already in use!";
        } else {
          branchNameError.value = false;
          nameError.value = "";
        }
      }, 800);
    });
    const descriptionCharsRemaining = ref(maxDescriptionChars);
    const branchDescriptionModel = ref(null);
    const descriptionError = ref("");
    const branchDescError = ref(false);
    watch(branchDescriptionModel, (value) => {
      descriptionCharsRemaining.value = maxDescriptionChars - value.length;
      if (value.length > maxDescriptionChars) {
        branchDescriptionModel.value = value.slice(0, maxDescriptionChars);
      }
      branchDescError.value = value.length > maxDescriptionChars;
      if (branchDescError.value) {
        descriptionError.value = "Sorry, your description is too long!";
      } else {
        descriptionError.value = "";
      }
    });
    ref(null);
    const branchTypeModel = ref(null);
    ref(null);
    const branchSubmitError = ref(false);
    const branchLoadingIndicator = ref(false);
    const branchSubmitMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: ("isCreatingIndex" in _ctx ? _ctx.isCreatingIndex : unref(isCreatingIndex))().value ? null : { display: "none" },
        class: "create-panel"
      }, _attrs))} data-v-615e53ba><nav class="options" data-v-615e53ba><ul data-v-615e53ba><li data-v-615e53ba><button class="create-post active" alt="Create a post" title="Create a post" data-v-615e53ba><h3 class="title" data-v-615e53ba>Create a post</h3></button></li><li data-v-615e53ba><button class="create-post inactive" alt="Create a branch" title="Create a branch" data-v-615e53ba><h3 class="title" data-v-615e53ba>Create a branch</h3></button></li><li data-v-615e53ba></li><li data-v-615e53ba><button class="close" alt="Close" title="Close create panel" data-v-615e53ba><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-615e53ba><path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" data-v-615e53ba></path></svg></button></li></ul></nav><section class="content" data-v-615e53ba>`);
      if (unref(isCreatePost)) {
        _push(`<form class="create-post" data-v-615e53ba><div class="title" data-v-615e53ba><h3 data-v-615e53ba>Post title</h3><input type="text" placeholder="Title" data-v-615e53ba></div><div class="content" data-v-615e53ba><h3 data-v-615e53ba>Content</h3><textarea placeholder="Content" data-v-615e53ba></textarea></div><div class="submit" data-v-615e53ba><button class="submit" alt="Submit" title="Submit" data-v-615e53ba><h3 data-v-615e53ba>Submit</h3></button></div></form>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isCreatePost)) {
        _push(`<form class="create-branch" data-v-615e53ba><div class="field name container" data-v-615e53ba><div data-v-615e53ba><label for="branch-name" data-v-615e53ba>Name your branch</label><input id="branch-name" class="branch-name-input"${ssrRenderAttr("value", unref(branchInputModel))} type="text" autocomplete="off" required data-v-615e53ba><p class="placeholder" data-v-615e53ba>b/</p><div class="tooltip" data-v-615e53ba><p class="tip" style="${ssrRenderStyle(!unref(branchNameError) ? null : { display: "none" })}" data-v-615e53ba>Characters remaining: <span data-v-615e53ba>${ssrInterpolate(unref(branchCharactersRemaining))}</span></p><p class="error" style="${ssrRenderStyle(unref(branchNameError) ? null : { display: "none" })}" data-v-615e53ba>${ssrInterpolate(unref(nameError))}</p></div></div><div data-v-615e53ba><label for="branch-type" data-v-615e53ba>Set your branch visibility</label><select id="branch-type" class="branch-type-input" required data-v-615e53ba><option value="public" title="Anybody can view the community" selected data-v-615e53ba>Public</option><option value="secret" title="Anybody with a link or an invite can view the community" data-v-615e53ba${ssrIncludeBooleanAttr(Array.isArray(unref(branchTypeModel)) ? ssrLooseContain(unref(branchTypeModel), "secret") : ssrLooseEqual(unref(branchTypeModel), "secret")) ? " selected" : ""}>Secret</option></select></div></div><div class="field description" data-v-615e53ba><label for="branch-description" data-v-615e53ba>Describe your branch</label><textarea id="branch-description" class="branch-description-input" placeholder="Let people know what your community is all about" autocomplete="off" required data-v-615e53ba>${ssrInterpolate(unref(branchDescriptionModel))}</textarea><div class="tooltip" data-v-615e53ba><p class="tip" style="${ssrRenderStyle(!unref(branchDescError) ? null : { display: "none" })}" data-v-615e53ba>Characters remaining: <span data-v-615e53ba>${ssrInterpolate(unref(descriptionCharsRemaining))}</span></p><p class="error" id="description-error" style="${ssrRenderStyle(unref(branchDescError) ? null : { display: "none" })}" data-v-615e53ba>${ssrInterpolate(unref(descriptionError))}</p></div></div><div class="field submit" data-v-615e53ba><p class="message" style="${ssrRenderStyle(!unref(branchSubmitError) ? null : { display: "none" })}" data-v-615e53ba>${ssrInterpolate(unref(branchSubmitMessage))}</p><p class="error" style="${ssrRenderStyle(unref(branchSubmitError) ? null : { display: "none" })}" data-v-615e53ba></p><button class="submit disabled" alt="Submit" title="Submit" data-v-615e53ba><h3 style="${ssrRenderStyle(!unref(branchLoadingIndicator) ? null : { display: "none" })}" data-v-615e53ba>Submit</h3><svg style="${ssrRenderStyle(unref(branchLoadingIndicator) ? null : { display: "none" })}" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-615e53ba><path d="M196 725q-20-36-28-72.5t-8-74.5q0-131 94.5-225.5T480 258h43l-80-80 39-39 149 149-149 149-40-40 79-79h-41q-107 0-183.5 76.5T220 578q0 29 5.5 55t13.5 49l-43 43Zm280 291L327 867l149-149 39 39-80 80h45q107 0 183.5-76.5T740 577q0-29-5-55t-15-49l43-43q20 36 28.5 72.5T800 577q0 131-94.5 225.5T480 897h-45l80 80-39 39Z" data-v-615e53ba></path></svg></button></div></form>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/index/create-panel.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-615e53ba"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "post2",
  __ssrInlineRender: true,
  setup(__props) {
    const postElement = ref(null);
    ref(null);
    const isLiked = ref(false);
    const isDisliked = ref(false);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0;
      _push(`<article${ssrRenderAttrs(mergeProps({
        ref_key: "postElement",
        ref: postElement,
        class: "post"
      }, _attrs))}><header><div class="post-info"><div class="branch-attributes"><div class="branch-icon"><img src="https://i.imgur.com/Rnj7kZj.jpeg"></div>`);
      _push(ssrRenderComponent(_component_nuxt_link, { class: "branch-name" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`b/overwatch`);
          } else {
            return [
              createTextVNode("b/overwatch")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="dot">.</p><p class="post-time">4hr ago</p></div><div class="user-attributes"><p class="user-name"><span>posted by</span> `);
      _push(ssrRenderComponent(_component_nuxt_link, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`cadywamapus`);
          } else {
            return [
              createTextVNode("cadywamapus")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div><h3 class="title">For real though, what is the counterplay for Widow?</h3></header><section class="body"><div class="text-body"><div class="content"><p> Hey guys, </p><p> I recently got my DPS to Plat 1, which means all my roles are now that rank or higher. My MMR has hit the point where Widow players can dominate lobbies now. I&#39;m going to be real with you, it&#39;s so SO incredibly frustrating. She&#39;s picked in over half of my games and I cannot find adequate counterplay no matter what I try. It&#39;s to the point where I can only play a few games before I have to quit for the day because I&#39;m so tilted by Widow players. </p><p> I mainly play support. I can try and click on her head as Kiriko, right-click her as Zen or harass her as Ana, but she clicks on my head faster so I have a low success rate of even forcing her to reposition. </p><p> I only play Cass and Ashe for DPS and both of them have too much fall-off to scare a Widow away. Even if I try, I usually get my head clicked on and it&#39;s a 4v5 for my team. </p><p> Edit: I know a lot of the responses for DPS will be to just mirror the Widow. I understand this is probably the best option, but my Widow win rate is ~40%. I can get a few picks here and there but I instantly lose any Widow 1v1. I find her boring to play as and she is not the hero I want to focus on getting better at. </p></div><div class="fade"></div></div></section><footer><section class="interaction-bar"><div class="like">`);
      if (unref(isLiked)) {
        _push(`<svg class="liked" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m480 935-41-37q-106-97-175-167.5t-110-126Q113 549 96.5 504T80 413q0-90 60.5-150.5T290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.5T880 413q0 46-16.5 91T806 604.5q-41 55.5-110 126T521 898l-41 37Z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isLiked)) {
        _push(`<svg class="unliked" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="m480 935-41-37q-105.768-97.121-174.884-167.561Q195 660 154 604.5T96.5 504Q80 459 80 413q0-90.155 60.5-150.577Q201 202 290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.423Q880 322.845 880 413q0 46-16.5 91T806 604.5Q765 660 695.884 730.439 626.768 800.879 521 898l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712 630 750.5 580t54-89.135q15.5-39.136 15.5-77.72Q820 347 778 304.5T670.225 262q-51.524 0-95.375 31.5Q531 325 504 382h-49q-26-56-69.85-88-43.851-32-95.375-32Q224 262 182 304.5t-42 108.816Q140 452 155.5 491.5t54 90Q248 632 314 698t166 158Zm0-297Z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p>623</p></div><div class="dislike">`);
      if (unref(isDisliked)) {
        _push(`<svg class="disliked" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M239 216h467v512l-278 288-33-26q-11-8-14.5-18t-3.5-23v-10l45-211H100q-23 0-41.5-18.5T40 668v-82q0-11 2.5-25.5T50 535l116-268q9-21 29.5-36t43.5-15Zm527 512V216h114v512H766Z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isDisliked)) {
        _push(`<svg class="undisliked" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M242 216h444v512l-278 288-39-31q-6-5-9-14t-3-22v-10l45-211H103q-24 0-42-18t-18-42v-81.839Q43 579 41.5 571.5T43 557l126-290q8.878-21.25 29.595-36.125Q219.311 216 242 216Zm384 60H229L103 575v93h373l-53 249 203-214V276Zm0 427V276v427Zm60 25v-60h133V276H686v-60h193v512H686Z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p>8</p></div><div class="comment"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M80 976V236q0-23 18-41.5t42-18.5h680q23 0 41.5 18.5T880 236v520q0 23-18.5 41.5T820 816H240L80 976Zm60-145 75-75h605V236H140v595Zm0-595v595-595Z"></path></svg><p>20</p></div></section><section class="more-bar"></section></footer></article>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/posts/post2.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const indexPostCurrentAvailableZones = () => useState("indexPostCurrentAvailableZones", () => "three");
const controlBarPostitionIndex = () => useState("controlBarPostitionIndex", () => "middle");
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "authenticated",
  __ssrInlineRender: true,
  setup(__props) {
    const { pending, data: posts } = useLazyFetch("/api/posts", "$zZn01p7RZK");
    watch(posts, (newPosts) => {
    });
    const overflowY = ref(null);
    const postsContainer = ref(null);
    watch(isCreatingIndex, (newIsCreating) => {
      if (newIsCreating.value === true) {
        postsContainer.value.classList.add("creating");
        overflowY.value.style.height = "calc(100vh + 0.5rem)";
      } else {
        postsContainer.value.classList.remove("creating");
        overflowY.value.style.height = "100%";
      }
    });
    const posX = ref(0);
    const posY = ref(0);
    let browserWidth = 0;
    const leftLimit = ref(0);
    function dockPostFeed() {
      const browserWidth2 = (void 0).body.clientWidth;
      const zoneWidth = browserWidth2 / 3;
      const zoneThreshold = zoneWidth / 2;
      if (browserWidth2 > 1e3) {
        indexPostCurrentAvailableZones().value = "three";
        tripleZoneDock(zoneThreshold);
      } else {
        indexPostCurrentAvailableZones().value = "one";
        singleZoneDock();
      }
      posY.value = 0;
    }
    function tripleZoneDock(zoneThreshold) {
      if (posX.value <= -leftLimit.value + zoneThreshold) {
        posX.value = -leftLimit.value;
        controlBarPostitionIndex().value = "left";
      } else if (posX.value >= leftLimit.value - zoneThreshold) {
        posX.value = leftLimit.value;
        controlBarPostitionIndex().value = "right";
      } else {
        posX.value = 0;
        controlBarPostitionIndex().value = "middle";
      }
    }
    function singleZoneDock() {
      posX.value = 0;
      controlBarPostitionIndex().value = "middle";
    }
    function smoothDamp(t, L = 200, k = 9e-3, x0 = 199) {
      return L / (1 + Math.exp(-k * (t - x0)));
    }
    onUnmounted(() => {
      isCreatingIndex().value = false;
      (void 0).removeEventListener("resize", () => {
        browserWidth = (void 0).body.clientWidth;
        leftLimit.value = (browserWidth - postsContainer.value.clientWidth - 50) / 2;
        dockPostFeed();
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ControlBar = __nuxt_component_0$1;
      const _component_IndexCreatePanel = __nuxt_component_1;
      const _component_PostsPost = _sfc_main$5;
      const _component_PostsPost2 = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "overflow",
        ref_key: "overflowY",
        ref: overflowY
      }, _attrs))} data-v-65fbf640><section class="posts-feed" style="${ssrRenderStyle(`top: clamp(0px, ${unref(posY) + "px"}, ${smoothDamp(unref(posY))}px); left: clamp(-${unref(leftLimit)}px, ${unref(posX) + "px"}, ${unref(leftLimit) - 8}px)`)}" data-v-65fbf640><div class="draggable" data-v-65fbf640>`);
      _push(ssrRenderComponent(_component_ControlBar, { currentPage: "index" }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_IndexCreatePanel, null, null, _parent));
      _push(`<div class="post-container" data-v-65fbf640>`);
      if (unref(pending)) {
        _push(`<div class="posts-pending" data-v-65fbf640><p style="${ssrRenderStyle({ "margin-top": "3rem" })}" data-v-65fbf640>Loading</p></div>`);
      } else {
        _push(`<div class="posts-loaded" data-v-65fbf640><section class="posts" data-v-65fbf640><div class="fade" data-v-65fbf640></div>`);
        _push(ssrRenderComponent(_component_PostsPost, { class: "text" }, null, _parent));
        _push(ssrRenderComponent(_component_PostsPost2, { class: "text rising" }, null, _parent));
        _push(ssrRenderComponent(_component_PostsPost, { class: "media" }, null, _parent));
        _push(ssrRenderComponent(_component_PostsPost, { class: "media rising" }, null, _parent));
        _push(`</section></div>`);
      }
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/index/authenticated.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const authenticated = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-65fbf640"]]);
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<p${ssrRenderAttrs(mergeProps({
    style: { "margin-top": "10rem" },
    class: "text-center"
  }, _attrs))}> You are not authenticated. </p>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/index/unauthenticated.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const unauthenticated = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Home",
      meta: [{
        name: "description",
        content: "This is the home page"
      }]
    });
    const { status, signOut, data } = useAuth();
    ref(false);
    ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = Head;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<link rel="preconnect" href="https://fonts.googleapis.com"${_scopeId}><link rel="preconnect" href="https://fonts.gstatic.com"${_scopeId}><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet"${_scopeId}>`);
          } else {
            return [
              createVNode("link", {
                rel: "preconnect",
                href: "https://fonts.googleapis.com"
              }),
              createVNode("link", {
                rel: "preconnect",
                href: "https://fonts.gstatic.com"
              }),
              createVNode("link", {
                href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
                rel: "stylesheet"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(status) === "authenticated") {
        _push(ssrRenderComponent(authenticated, null, null, _parent));
      } else {
        _push(ssrRenderComponent(unauthenticated, null, null, _parent));
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-stdhPAO4.mjs.map
