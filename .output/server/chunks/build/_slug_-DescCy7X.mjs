import { _ as __nuxt_component_0$1 } from './nuxt-link-P6SDANQl.mjs';
import { _ as _export_sfc, c as useAuth, d as useRoute } from './server.mjs';
import { useSSRContext, defineComponent, ref, onUnmounted, unref, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, withAsyncContext } from 'vue';
import { r as regexDisplayIdRaw } from './filterName-DJNXPkgF.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as __nuxt_component_0$2, a as _sfc_main$3 } from './post-CnQtPsHh.mjs';
import { u as useLazyFetch } from './fetch-CcPjIrR6.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "branch-head",
  __ssrInlineRender: true,
  props: ["branchData", "isPending"],
  setup(__props) {
    var _a, _b;
    const { status, data } = useAuth();
    const props = __props;
    const isPending = ref(props.isPending);
    const isOwnerAdmin = ref(false);
    if (isPending.value) {
      console.log("Pending");
    } else {
      if (status.value === "authenticated") {
        const userId = regexDisplayIdRaw((_b = (_a = data.value) == null ? void 0 : _a.user) == null ? void 0 : _b.name);
        const branchOwnerId = props.branchData.branch.owner_user_id;
        if (userId === branchOwnerId) {
          isOwnerAdmin.value = true;
        }
      }
    }
    const branchHeader = ref(null);
    let lastScrollY = 0;
    let canShrink = false;
    function updateHideHeader(progress) {
      if (progress < 700) {
        canShrink = false;
      } else {
        canShrink = true;
      }
      if (!canShrink) {
        if (!branchHeader.value.classList.contains("hide")) {
          lastScrollY = progress;
          return;
        }
        branchHeader.value.classList.remove("hide");
        lastScrollY = progress;
        return;
      }
      if (progress < lastScrollY) {
        if (!branchHeader.value.classList.contains("hide")) {
          lastScrollY = progress;
          return;
        }
        branchHeader.value.classList.remove("hide");
      } else {
        if (branchHeader.value.classList.contains("hide")) {
          lastScrollY = progress;
          return;
        }
        branchHeader.value.classList.add("hide");
      }
      lastScrollY = progress;
    }
    const branchIcon = ref(null);
    function updateIconElement(progress) {
      const scale = 1 - progress * 0.55;
      const top = `${-3 * (1 - progress) + 0.535}rem`;
      const left = `${progress * 1.1}rem`;
      branchIcon.value.style.transform = `scale(${scale})`;
      branchIcon.value.style.top = top;
      branchIcon.value.style.left = left;
    }
    const branchTitle = ref(null);
    const branchId = ref(null);
    function updateTitleELements(progress) {
      const titleOpacity = `${1 - progress}`;
      const top = `-${progress * 0.08}rem`;
      const left = `-${progress * 0.8}rem`;
      let idOpacity = progress;
      let fontWeight = 400;
      let fontSize = "1rem";
      if (progress < 0.6) {
        idOpacity = 0.6;
      }
      if (progress == 1) {
        fontSize = "1.5rem";
        fontWeight = 600;
      }
      branchTitle.value.style.opacity = titleOpacity;
      branchId.value.style.opacity = idOpacity;
      branchId.value.style.fontSize = fontSize;
      branchId.value.style.fontWeight = fontWeight;
      branchId.value.style.top = top;
      branchId.value.style.left = left;
    }
    const editBranchButton = ref(null);
    function updateEditElement(progress) {
      const opacity = `${1 - progress}`;
      editBranchButton.value.style.opacity = opacity;
      if (progress == 1) {
        if (editBranchButton.value.style.display === "none")
          return;
        editBranchButton.value.style.display = "none";
      } else {
        if (editBranchButton.value.style.display === "block")
          return;
        editBranchButton.value.style.display = "block";
      }
    }
    function calculateScroll() {
      let scrollYAbsolute = (void 0).scrollY;
      let scrollY = scrollYAbsolute;
      const minScroll = 50;
      const maxScroll = 130;
      if (scrollY > maxScroll) {
        scrollY = maxScroll;
      }
      if (scrollY < minScroll) {
        scrollY = minScroll;
      }
      const progress = (scrollY - minScroll) / (maxScroll - minScroll);
      updateIconElement(progress);
      updateTitleELements(progress);
      if (editBranchButton.value) {
        updateEditElement(progress);
      }
      updateHideHeader(scrollYAbsolute);
    }
    onUnmounted(() => {
      (void 0).removeEventListener("scroll", calculateScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      if (unref(isPending)) {
        _push(`<header${ssrRenderAttrs(mergeProps({ class: "branch-header pending" }, _attrs))} data-v-24ddea42><div class="background-image" data-v-24ddea42><div class="fade" data-v-24ddea42></div></div><div class="title" data-v-24ddea42><div class="icon" data-v-24ddea42></div><div class="text" data-v-24ddea42><h1 class="branch-title pending-large" data-v-24ddea42></h1><p class="pending" data-v-24ddea42></p></div></div></header>`);
      } else {
        _push(`<header${ssrRenderAttrs(mergeProps({
          class: "branch-header",
          ref_key: "branchHeader",
          ref: branchHeader
        }, _attrs))} data-v-24ddea42><div class="background-image" data-v-24ddea42><img${ssrRenderAttr("src", __props.branchData.branch.background_image)} data-v-24ddea42><div class="fade" data-v-24ddea42></div></div><div class="branch-info" data-v-24ddea42><div class="title" data-v-24ddea42><div class="icon" data-v-24ddea42><img${ssrRenderAttr("src", __props.branchData.branch.icon_image)} data-v-24ddea42></div><div class="text" data-v-24ddea42><h1 data-v-24ddea42>${ssrInterpolate(__props.branchData.branch.branch_title)}</h1><p data-v-24ddea42>b/${ssrInterpolate(__props.branchData.branch.branch_name)}</p></div><div class="branch-interaction" data-v-24ddea42>`);
        if (unref(isOwnerAdmin)) {
          _push(`<div class="edit" data-v-24ddea42>`);
          _push(ssrRenderComponent(_component_nuxt_link, {
            class: "edit-button",
            to: `/edit/b/${__props.branchData.branch.branch_name}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-24ddea42${_scopeId}><path d="M794 390 666 262l42-42q17-17 42.5-16.5T793 221l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Z" data-v-24ddea42${_scopeId}></path></svg>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    height: "48",
                    viewBox: "0 96 960 960",
                    width: "48"
                  }, [
                    createVNode("path", { d: "M794 390 666 262l42-42q17-17 42.5-16.5T793 221l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Z" })
                  ]))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></header>`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/branches/branch-head.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-24ddea42"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "post3",
  __ssrInlineRender: true,
  setup(__props) {
    const postElement = ref(null);
    ref(null);
    const isLiked = ref(false);
    const isDisliked = ref(false);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
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
      _push(`</p></div></div><h3 class="title">How to create a welcome message for your community</h3></header><section class="body"><div class="text-body"><div class="content"><p> Welcome to this guide on welcome messages! </p><p> It&#39;s a new feature that automatically sends a message to users who join your community. As a mod you can optionally set one and write exactly what you want the message to say. Currently, the user will receive it within an hour of joining. </p><p> Before you begin: Welcome messages can only be set from new Reddit on desktop or on the official mobile app. If you use old Reddit, just replace the &quot;www&quot; in your URL with &quot;new&quot; temporarily, set the message, and then go back. If you don&#39;t have the app, either go find a desktop or open new Reddit in desktop mode. </p><p> Mod permissions required: Since welcome messages are set in the community settings, you would require config perms to manage it </p><p> It&#39;s really up to you, but here are some tips! Keep it 5,000 characters or under and users will get it as a pop up Don&#39;t go overboard, because if it&#39;s too long, users might not even read it Don&#39;t turn it into a rules page, you should mention your rules and maybe do a high-level interpretation of them so users get the basic idea. However, you could link them to your official rules page or relevant wiki pages Give relevant information about your community, for example in the case of TV show communities, give them information on how to watch the show and a link to your episode discussions Consider including a link to a poll in your welcome message (Google Docs, Straw Poll, or somewhere else). Ask users if the welcome message was useful or not Overall: Be welcoming! </p></div><div class="fade"></div></div></section><footer><section class="interaction-bar"><div class="like">`);
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
      _push(`<p>2</p></div><div class="dislike">`);
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
      _push(`<p>20</p></div><div class="comment"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M80 976V236q0-23 18-41.5t42-18.5h680q23 0 41.5 18.5T880 236v520q0 23-18.5 41.5T820 816H240L80 976Zm60-145 75-75h605V236H140v595Zm0-595v595-595Z"></path></svg><p>20</p></div></section><section class="more-bar"></section></footer></article>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/posts/post3.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { slug } = useRoute().params;
    const { data: branchData, pending } = ([__temp, __restore] = withAsyncContext(() => useLazyFetch(`/api/branches/get/branch?name=${slug}`, "$XmLfWrQz86")), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BranchesBranchHead = __nuxt_component_0;
      const _component_ControlBar = __nuxt_component_0$2;
      const _component_PostsPost3 = _sfc_main$1;
      const _component_PostsPost = _sfc_main$3;
      _push(`<!--[-->`);
      if (unref(pending)) {
        _push(ssrRenderComponent(_component_BranchesBranchHead, {
          branchData: null,
          isPending: unref(pending)
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_BranchesBranchHead, {
          branchData: unref(branchData),
          isPending: unref(pending)
        }, null, _parent));
      }
      _push(`<section class="post-feed" data-v-1fa1d3e2>`);
      _push(ssrRenderComponent(_component_ControlBar, { currentPage: "branch" }, null, _parent));
      _push(ssrRenderComponent(_component_PostsPost3, { class: "text" }, null, _parent));
      _push(ssrRenderComponent(_component_PostsPost, { class: "text rising" }, null, _parent));
      _push(ssrRenderComponent(_component_PostsPost, null, null, _parent));
      _push(ssrRenderComponent(_component_PostsPost, null, null, _parent));
      _push(ssrRenderComponent(_component_PostsPost, null, null, _parent));
      _push(ssrRenderComponent(_component_PostsPost, null, null, _parent));
      _push(ssrRenderComponent(_component_PostsPost, null, null, _parent));
      _push(ssrRenderComponent(_component_PostsPost, null, null, _parent));
      _push(`</section><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/b/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1fa1d3e2"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-DescCy7X.mjs.map
