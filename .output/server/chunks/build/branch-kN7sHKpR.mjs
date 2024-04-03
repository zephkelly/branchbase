import { a as useFetch } from './fetch-CcPjIrR6.mjs';

async function branchExists(name) {
  var _a;
  const doesBranchExist = await useFetch(`/api/branches/exists?branchName=${name}`, "$PWUwziH0rh");
  if (((_a = doesBranchExist.data.value) == null ? void 0 : _a.statusCode) == 200) {
    return true;
  } else {
    return false;
  }
}

export { branchExists as b };
//# sourceMappingURL=branch-kN7sHKpR.mjs.map
