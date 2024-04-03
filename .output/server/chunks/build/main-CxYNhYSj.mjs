import { H as Head } from './components-Dnihj8JX.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link-P6SDANQl.mjs';
import { useSSRContext, defineComponent, ref, watch, onUnmounted, mergeProps, unref, computed, withAsyncContext, withCtx, createVNode, toDisplayString, createTextVNode } from 'vue';
import { _ as _export_sfc, d as useRoute, c as useAuth, e as useState } from './server.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { a as useFetch } from './fetch-CcPjIrR6.mjs';
import { b as regexDisplayName } from './filterName-DJNXPkgF.mjs';

const toggleFeedMenu = () => useState("feedToggle", () => false);
const toggleFeedMenuString = () => useState("feedToggleText", () => "Home");
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "button-browse",
  __ssrInlineRender: true,
  setup(__props) {
    const currentFeedButton = ref(null);
    watch(toggleFeedMenu(), (value) => {
      var _a, _b;
      if (value) {
        (_a = currentFeedButton.value) == null ? void 0 : _a.classList.add("active");
      } else {
        (_b = currentFeedButton.value) == null ? void 0 : _b.classList.remove("active");
      }
    });
    onUnmounted(() => {
      toggleFeedMenu().value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        ref_key: "currentFeedButton",
        ref: currentFeedButton,
        class: "current-feed",
        title: "Explore your feeds and communities."
      }, _attrs))} data-v-c690de6d><p data-v-c690de6d>${ssrInterpolate(("toggleFeedMenuString" in _ctx ? _ctx.toggleFeedMenuString : unref(toggleFeedMenuString))().value)}</p><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" data-v-c690de6d><path d="M480 711 240 471l43-43 197 198 197-197 43 43-240 239Z" data-v-c690de6d></path></svg></button>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/button-browse.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-c690de6d"]]);
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_nuxt_link = __nuxt_component_0$2;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "feeds" }, _attrs))} data-v-c0637fd6><h6 class="title" data-v-c0637fd6>Feeds</h6><p class="subtitle" data-v-c0637fd6>Content curated by topic</p><nav data-v-c0637fd6><ul data-v-c0637fd6>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: "/",
    onClick: ($event) => ("toggleFeedMenu" in _ctx ? _ctx.toggleFeedMenu : unref(toggleFeedMenu))().value = false
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<li data-v-c0637fd6${_scopeId}><img data-v-c0637fd6${_scopeId}><p to="/" data-v-c0637fd6${_scopeId}>Home</p></li>`);
      } else {
        return [
          createVNode("li", null, [
            createVNode("img"),
            createVNode("p", { to: "/" }, "Home")
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: "/explore",
    onClick: ($event) => ("toggleFeedMenu" in _ctx ? _ctx.toggleFeedMenu : unref(toggleFeedMenu))().value = false
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<li data-v-c0637fd6${_scopeId}><img data-v-c0637fd6${_scopeId}><p data-v-c0637fd6${_scopeId}>Explore</p></li>`);
      } else {
        return [
          createVNode("li", null, [
            createVNode("img"),
            createVNode("p", null, "Explore")
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: "/rising",
    onClick: ($event) => ("toggleFeedMenu" in _ctx ? _ctx.toggleFeedMenu : unref(toggleFeedMenu))().value = false
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<li data-v-c0637fd6${_scopeId}><img data-v-c0637fd6${_scopeId}><p data-v-c0637fd6${_scopeId}>Rising</p></li>`);
      } else {
        return [
          createVNode("li", null, [
            createVNode("img"),
            createVNode("p", null, "Rising")
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</ul></nav></section>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/browse-feeds.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c0637fd6"]]);
const limit = 6;
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "browse-branches",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const loadMoreBranches = computed(() => {
      var _a, _b;
      return ((_b = (_a = branches == null ? void 0 : branches.value) == null ? void 0 : _a.body) == null ? void 0 : _b.metadata.totalBranches) > limit;
    });
    const showViewAll = ref(false);
    const { data: branches, pending } = ([__temp, __restore] = withAsyncContext(() => useFetch(`/api/branches?page=1&limit=${limit}`, { pick: ["body"] }, "$ANImgln1xw")), __temp = await __temp, __restore(), __temp);
    const branchList = ref([]);
    branchList.value = branches.value.body.branches;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "branches-explore" }, _attrs))} data-v-313776f2><h6 class="title" data-v-313776f2>Explore Communities</h6><p class="subtitle" data-v-313776f2>Join the discussion</p><nav data-v-313776f2>`);
      if (unref(pending)) {
        _push(`<div data-v-313776f2> Loading ... </div>`);
      } else {
        _push(`<ul data-v-313776f2><!--[-->`);
        ssrRenderList(unref(branchList), (branch) => {
          _push(`<li${ssrRenderAttr("title", branch.description)} data-v-313776f2>`);
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: "/b/" + branch.branch_name,
            onClick: ($event) => ("toggleFeedMenu" in _ctx ? _ctx.toggleFeedMenu : unref(toggleFeedMenu))().value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", branch.icon_image)} data-v-313776f2${_scopeId}><p data-v-313776f2${_scopeId}>b/${ssrInterpolate(branch.branch_name)}</p>`);
              } else {
                return [
                  createVNode("img", {
                    src: branch.icon_image
                  }, null, 8, ["src"]),
                  createVNode("p", null, "b/" + toDisplayString(branch.branch_name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]-->`);
        if (unref(loadMoreBranches) && !unref(showViewAll)) {
          _push(`<div class="more-button" data-v-313776f2>`);
          if (!unref(showViewAll)) {
            _push(`<a data-v-313776f2>+ View more</a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(loadMoreBranches) && unref(showViewAll)) {
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: "/branches/all",
            class: "more-button viewall"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<a data-v-313776f2${_scopeId}>+ View all</a>`);
              } else {
                return [
                  createVNode("a", null, "+ View all")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(loadMoreBranches) && unref(showViewAll)) {
          _push(`<div class="more-button hide" data-v-313776f2><a data-v-313776f2>- Hide more</a></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul>`);
      }
      _push(`</nav></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/browse-branches.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-313776f2"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "browse",
  __ssrInlineRender: true,
  setup(__props) {
    const sideNav = ref(null);
    watch(toggleFeedMenu(), (value) => {
      var _a, _b;
      if (value) {
        (_a = sideNav.value) == null ? void 0 : _a.classList.remove("minimise");
      } else {
        (_b = sideNav.value) == null ? void 0 : _b.classList.add("minimise");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NavigationBrowseFeeds = __nuxt_component_0$1;
      const _component_NavigationBrowseBranches = __nuxt_component_1;
      _push(`<aside${ssrRenderAttrs(mergeProps({
        ref_key: "sideNav",
        ref: sideNav,
        class: "side-nav minimise"
      }, _attrs))} data-v-941dc50d><div class="lists" data-v-941dc50d>`);
      _push(ssrRenderComponent(_component_NavigationBrowseFeeds, null, null, _parent));
      _push(ssrRenderComponent(_component_NavigationBrowseBranches, null, null, _parent));
      _push(`</div></aside>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/browse.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-941dc50d"]]);
const _imports_0 = "data:image/png;base64,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";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { data, signOut } = useAuth();
    const userName = computed(() => {
      return regexDisplayName(data);
    });
    const showLogin = computed(() => {
      if (route.path === "/login" || route.path == "/register" || route.path == "/forgot-password") {
        return false;
      }
      return true;
    });
    const shouldLogout = computed(() => {
      var _a;
      return (_a = data.value) == null ? void 0 : _a.user;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = Head;
      const _component_nuxt_link = __nuxt_component_0$2;
      const _component_NavigationButtonBrowse = __nuxt_component_2;
      const _component_NavigationBrowse = __nuxt_component_3;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<link rel="preconnect" href="https://fonts.googleapis.com" data-v-b20d4837${_scopeId}><link rel="preconnect" href="https://fonts.gstatic.com" data-v-b20d4837${_scopeId}><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet" data-v-b20d4837${_scopeId}>`);
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
      _push(`<header data-v-b20d4837>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        class: "logo",
        to: "/",
        onClick: ($event) => ("toggleFeedMenu" in _ctx ? _ctx.toggleFeedMenu : unref(toggleFeedMenu))().value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Logo" data-v-b20d4837${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Logo"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NavigationButtonBrowse, null, null, _parent));
      if (unref(showLogin)) {
        _push(`<div class="log-buttons" data-v-b20d4837>`);
        if (!unref(shouldLogout)) {
          _push(ssrRenderComponent(_component_nuxt_link, {
            ref: "loginButton",
            to: "/login"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Login`);
              } else {
                return [
                  createTextVNode("Login")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<button class="logout" data-v-b20d4837>Logout ${ssrInterpolate(unref(userName))}</button>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
      _push(ssrRenderComponent(_component_NavigationBrowse, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/navbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b20d4837"]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=main-CxYNhYSj.mjs.map
