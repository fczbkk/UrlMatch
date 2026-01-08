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
var pattern_exports = {};
__export(pattern_exports, {
  default: () => Pattern
});
module.exports = __toCommonJS(pattern_exports);
var import_scheme = __toESM(require("./scheme.js"));
var import_host = __toESM(require("./host.js"));
var import_path = __toESM(require("./path.js"));
var import_params = __toESM(require("./params.js"));
var import_fragment = __toESM(require("./fragment.js"));
const split_re = new RegExp(
  "^(?<scheme>[a-z]+|\\*)*://(?:[^\\/\\#\\?]+@)*(?<host>[\\w\\*\\.\\-]+)*(?:\\:\\d+)*(?:/(?<path>[^\\?\\#]*))*(?:\\?(?<params>[^\\#]*))*(?:\\#(?<fragment>.*))*"
  // fragment: everything after # (optional)
);
const URL_PARTS = ["scheme", "host", "path", "params", "fragment"];
class Pattern {
  constructor(pattern) {
    if (pattern === "*" || pattern === "<all_urls>") {
      pattern = "*://*/*?*#*";
    }
    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
    this.url_parts = this.getUrlParts(this.pattern);
  }
  split(pattern = "", empty_value = null) {
    const result = {
      scheme: null,
      host: null,
      path: null,
      params: null,
      fragment: null
    };
    const match = pattern.match(split_re);
    if (match?.groups) {
      result.scheme = match.groups.scheme ?? empty_value;
      result.host = match.groups.host ?? empty_value;
      result.path = match.groups.path ?? empty_value;
      result.params = match.groups.params ?? empty_value;
      result.fragment = match.groups.fragment ?? empty_value;
    }
    return result;
  }
  getUrlParts(pattern = this.pattern) {
    const splits = this.split(pattern);
    return {
      scheme: new import_scheme.default(splits.scheme),
      host: new import_host.default(splits.host),
      path: new import_path.default(splits.path),
      params: new import_params.default(splits.params),
      fragment: new import_fragment.default(splits.fragment)
    };
  }
  sanitize(pattern = this.original_pattern) {
    const universal_pattern = "*://*/*?*#*";
    if (pattern === "*" || pattern === "<all_urls>") {
      pattern = universal_pattern;
    }
    return pattern;
  }
  validate(url_parts = this.url_parts) {
    for (const key in url_parts) {
      const val = url_parts[key];
      if (!val.validate()) {
        return false;
      }
    }
    return true;
  }
  test(url) {
    if (url == null) {
      return false;
    }
    const splits = this.split(url);
    for (const part of URL_PARTS) {
      if (!this.url_parts[part].test(splits[part])) {
        return false;
      }
    }
    return true;
  }
  debug(url) {
    const splits = this.split(url);
    return {
      scheme: {
        pattern: this.url_parts.scheme.original_pattern,
        value: splits.scheme,
        result: this.url_parts.scheme.test(splits.scheme)
      },
      host: {
        pattern: this.url_parts.host.original_pattern,
        value: splits.host,
        result: this.url_parts.host.test(splits.host)
      },
      path: {
        pattern: this.url_parts.path.original_pattern,
        value: splits.path,
        result: this.url_parts.path.test(splits.path)
      },
      params: {
        pattern: this.url_parts.params.original_pattern,
        value: splits.params,
        result: this.url_parts.params.test(splits.params)
      },
      fragment: {
        pattern: this.url_parts.fragment.original_pattern,
        value: splits.fragment,
        result: this.url_parts.fragment.test(splits.fragment)
      }
    };
  }
}
if (module.exports.default) module.exports = module.exports.default;
