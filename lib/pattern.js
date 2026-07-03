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
var import_port = __toESM(require("./port.js"));
var import_path = __toESM(require("./path.js"));
var import_params = __toESM(require("./params.js"));
var import_fragment = __toESM(require("./fragment.js"));
const split_re = new RegExp(
  "^(?<scheme>[a-zA-Z]+|\\*)?://(?:[^\\/\\#\\?]+@)?(?<host>[\\w\\*\\.\\-]+)?(?:\\:(?<port>[\\d\\*]+))?(?:/(?<path>[^\\?\\#]*))?(?:\\?(?<params>[^\\#]*))?(?:\\#(?<fragment>.*))?$"
  // End of string
);
const URL_PARTS = ["scheme", "host", "port", "path", "params", "fragment"];
const DEFAULT_PORTS = {
  http: "80",
  https: "443"
};
class Pattern {
  constructor(pattern) {
    if (pattern === "*" || pattern === "<all_urls>") {
      pattern = "*://*/*?*#*";
    }
    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
    this.url_parts = this.getUrlParts(this.pattern);
    this.is_valid = this.validate(this.url_parts);
  }
  split(pattern = "", empty_value = null) {
    const result = {
      scheme: null,
      host: null,
      port: null,
      path: null,
      params: null,
      fragment: null
    };
    const match = pattern.match(split_re);
    if (match?.groups) {
      for (const part of URL_PARTS) {
        result[part] = match.groups[part] ?? empty_value;
      }
    }
    return result;
  }
  getUrlParts(pattern = this.pattern) {
    const splits = this.split(pattern);
    return {
      scheme: new import_scheme.default(splits.scheme),
      host: new import_host.default(splits.host),
      port: new import_port.default(splits.port),
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
  // split a tested URL, normalizing the case-insensitive parts
  // (scheme and host) so they match lowercase patterns
  splitUrl(url) {
    const splits = this.split(url);
    if (splits.scheme != null) {
      splits.scheme = splits.scheme.toLowerCase();
    }
    if (splits.host != null) {
      splits.host = splits.host.toLowerCase();
    }
    if (splits.port == null && splits.scheme != null) {
      splits.port = DEFAULT_PORTS[splits.scheme] ?? null;
    }
    return splits;
  }
  test(url) {
    if (!this.is_valid || url == null) {
      return false;
    }
    const splits = this.splitUrl(url);
    for (const part of URL_PARTS) {
      if (!this.url_parts[part].test(splits[part])) {
        return false;
      }
    }
    return true;
  }
  debug(url) {
    const splits = this.splitUrl(url);
    const result = {};
    for (const part of URL_PARTS) {
      const url_part = this.url_parts[part];
      result[part] = {
        pattern: url_part.original_pattern,
        value: splits[part],
        // part of an invalid pattern must never report a match
        result: url_part.validate() && url_part.test(splits[part])
      };
    }
    return result;
  }
}
if (module.exports.default) module.exports = module.exports.default;
