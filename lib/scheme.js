"use strict";
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
var scheme_exports = {};
__export(scheme_exports, {
  default: () => Scheme
});
module.exports = __toCommonJS(scheme_exports);
var import_url_part = __toESM(require("./url-part.js"));
var import_exists = __toESM(require("./utilities/exists.js"));
class Scheme extends import_url_part.default {
  validate(pattern = this.original_pattern) {
    if ((0, import_exists.default)(pattern)) {
      const re = new RegExp(
        "^(\\*|[a-z]+)$"
      );
      return re.test(pattern);
    }
    return false;
  }
  get sanitize_replacements() {
    return [
      // when using wildcard, only match http(s)
      { substring: "*", replacement: "https?" }
    ];
  }
}
if (module.exports.default) module.exports = module.exports.default;
