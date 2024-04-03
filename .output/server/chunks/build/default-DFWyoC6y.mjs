import { _ as __nuxt_component_0 } from './main-CxYNhYSj.mjs';
import { useSSRContext, defineComponent } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import './components-Dnihj8JX.mjs';
import './index-BabADJUJ.mjs';
import '@unhead/shared';
import './nuxt-link-P6SDANQl.mjs';
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
import './fetch-CcPjIrR6.mjs';
import './filterName-DJNXPkgF.mjs';
import 'unhead';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NavigationNavbar = __nuxt_component_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_NavigationNavbar, null, null, _parent));
      _push(`<main data-v-94299377>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-94299377"]]);

export { _default as default };
//# sourceMappingURL=default-DFWyoC6y.mjs.map
