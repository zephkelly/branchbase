import { useSSRContext, defineComponent, ref, watch, mergeProps, withCtx, createTextVNode, unref } from 'vue';
import { e as useState, _ as _export_sfc } from './server.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './nuxt-link-P6SDANQl.mjs';

const isCreatingIndex = () => useState("isCreatingIndex", () => false);
const isCreatingBranch = () => useState("isCreatingBranch", () => false);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "control-bar",
  __ssrInlineRender: true,
  props: ["currentPage"],
  setup(__props) {
    const createButton = ref(null);
    const layoutButton = ref(null);
    watch(isCreatingIndex(), (val) => {
      if (val === true) {
        createButton.value.classList.add("active");
        layoutButton.value.classList.add("inactive");
      } else {
        createButton.value.classList.remove("active");
        layoutButton.value.classList.remove("inactive");
      }
    });
    watch(isCreatingBranch(), (val) => {
      if (val === true) {
        createButton.value.classList.add("active");
      } else {
        createButton.value.classList.remove("active");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        ref: "navbar",
        class: "control-bar"
      }, _attrs))} data-v-4c4f90ab><div class="bar-content" data-v-4c4f90ab><div class="drag-handle" data-v-4c4f90ab><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-4c4f90ab><path d="M349.911 896Q321 896 300.5 875.411q-20.5-20.588-20.5-49.5Q280 797 300.589 776.5q20.588-20.5 49.5-20.5Q379 756 399.5 776.589q20.5 20.588 20.5 49.5Q420 855 399.411 875.5q-20.588 20.5-49.5 20.5Zm260 0Q581 896 560.5 875.411q-20.5-20.588-20.5-49.5Q540 797 560.589 776.5q20.588-20.5 49.5-20.5Q639 756 659.5 776.589q20.5 20.588 20.5 49.5Q680 855 659.411 875.5q-20.588 20.5-49.5 20.5Zm-260-250Q321 646 300.5 625.411q-20.5-20.588-20.5-49.5Q280 547 300.589 526.5q20.588-20.5 49.5-20.5Q379 506 399.5 526.589q20.5 20.588 20.5 49.5Q420 605 399.411 625.5q-20.588 20.5-49.5 20.5Zm260 0Q581 646 560.5 625.411q-20.5-20.588-20.5-49.5Q540 547 560.589 526.5q20.588-20.5 49.5-20.5Q639 506 659.5 526.589q20.5 20.588 20.5 49.5Q680 605 659.411 625.5q-20.588 20.5-49.5 20.5Zm-260-250Q321 396 300.5 375.411q-20.5-20.588-20.5-49.5Q280 297 300.589 276.5q20.588-20.5 49.5-20.5Q379 256 399.5 276.589q20.5 20.588 20.5 49.5Q420 355 399.411 375.5q-20.588 20.5-49.5 20.5Zm260 0Q581 396 560.5 375.411q-20.5-20.588-20.5-49.5Q540 297 560.589 276.5q20.588-20.5 49.5-20.5Q639 256 659.5 276.589q20.5 20.588 20.5 49.5Q680 355 659.411 375.5q-20.588 20.5-49.5 20.5Z" data-v-4c4f90ab></path></svg></div></div><div data-v-4c4f90ab><button class="create" title="Toggle create panel" data-v-4c4f90ab><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-4c4f90ab><path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z" data-v-4c4f90ab></path></svg></button></div>`);
      if (__props.currentPage === "index") {
        _push(`<button class="layout" title="Change layout" data-v-4c4f90ab><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" data-v-4c4f90ab><path d="M180 546q-24 0-42-18t-18-42V276q0-24 18-42t42-18h600q24 0 42 18t18 42v210q0 24-18 42t-42 18H180Zm0-60h600V276H180v210Zm0 450q-24 0-42-18t-18-42V666q0-24 18-42t42-18h600q24 0 42 18t18 42v210q0 24-18 42t-42 18H180Zm0-60h600V666H180v210Zm0-600v210-210Zm0 390v210-210Z" data-v-4c4f90ab></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/control-bar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4c4f90ab"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "post",
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
            _push2(`b/freelance`);
          } else {
            return [
              createTextVNode("b/freelance")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="dot">.</p><p class="post-time">1hr ago</p></div><div class="user-attributes"><p class="user-name"><span>posted by</span> `);
      _push(ssrRenderComponent(_component_nuxt_link, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`zephisthebomb`);
          } else {
            return [
              createTextVNode("zephisthebomb")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div><h3 class="title">Burnout and the effects of it. Looking for advice.</h3></header><section class="body"><div class="text-body"><div class="content"><p> Hey guys, </p><p> I&#39;ve been working on my freelance side hussle as a web developer for a good 1.5 years now. I do this on the side whilst maintaining a full-time job. </p><p> My typical day consists of; commuting to work (45 min), primary job (7.5 hrs), commute home (45 mins), work on freelance (3-4hrs). On the weekends, I try and take at least every other Saturday off. In total I&#39;m working roughly 60hrs (sometimes 70hrs if I need to finish a website) a week. </p><p> I know that&#39;s a fair amount of hours to work a week, and I fear my work quality is declining. I find it hard to focus on the task, and get distracted a lot more by my phone. A good night sleep usually restores my focus for a day, but then I feel myself get into another slump. </p><p> I suppose my question is, how long can I keep this up before my work really starts to suffer? I want to maintain my quality in my work. My main focus is to go fully freelance, but I&#39;ve been trying to line-up work in the pipeline whilst I work my 9-5. </p></div><div class="fade"></div></div></section><footer><section class="interaction-bar"><div class="like">`);
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
      _push(`<p>22</p></div><div class="dislike">`);
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
      _push(`<p>2</p></div><div class="comment"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M80 976V236q0-23 18-41.5t42-18.5h680q23 0 41.5 18.5T880 236v520q0 23-18.5 41.5T820 816H240L80 976Zm60-145 75-75h605V236H140v595Zm0-595v595-595Z"></path></svg><p>20</p></div></section><section class="more-bar"></section></footer></article>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/posts/post.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { __nuxt_component_0 as _, _sfc_main as a, isCreatingIndex as i };
//# sourceMappingURL=post-CnQtPsHh.mjs.map
