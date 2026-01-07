var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var path_exports = {};
__export(path_exports, {
  default: () => path_default
});
module.exports = __toCommonJS(path_exports);
var import_url_part = __toESM(require("./url-part"));
class path_default extends import_url_part.default {
  get default_value() {
    return "";
  }
  get sanitize_replacements() {
    return [
      // escape brackets
      { substring: /\(/, replacement: "\\(" },
      { substring: /\)/, replacement: "\\)" },
      // assume trailing slash at the end of path is optional
      { substring: /\/$/, replacement: "\\/?" },
      { substring: /\/\*$/, replacement: "((/?)|/*)" },
      // plus sign
      { substring: /\+/, replacement: "\\+" },
      // allow letters, numbers, plus signs, hyphens, dots, slashes
      // and underscores instead of wildcard
      { substring: /\*/g, replacement: "[a-zA-Z0-9+-./_:~!$&'()*,;=@%]*" }
    ];
  }
}
