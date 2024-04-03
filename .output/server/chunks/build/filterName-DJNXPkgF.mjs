function regexDisplayName(data) {
  var _a, _b;
  return (_b = (_a = data.value) == null ? void 0 : _a.user) == null ? void 0 : _b.name.replace(/\*.*$/, "");
}
function regexDisplayId(data) {
  var _a, _b;
  return (_b = (_a = data.value) == null ? void 0 : _a.user) == null ? void 0 : _b.name.replace(/.*\*/, "");
}
function regexDisplayIdRaw(data) {
  if (data == null || data == void 0) {
    return "";
  }
  return data.replace(/.*\*/, "");
}

export { regexDisplayId as a, regexDisplayName as b, regexDisplayIdRaw as r };
//# sourceMappingURL=filterName-DJNXPkgF.mjs.map
