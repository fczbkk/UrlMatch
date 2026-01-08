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
var params_exports = {};
__export(params_exports, {
  default: () => Params
});
module.exports = __toCommonJS(params_exports);
var import_url_part = __toESM(require("./url-part.js"));
class Params extends import_url_part.default {
  get is_required() {
    return false;
  }
  get invalidate_rules() {
    return [
      // two equal signs in a row
      /==/,
      // equal signs undivided by ampersand
      /=[^&]+=/,
      // single equal sign
      /^=$/
    ];
  }
  sanitize(pattern = this.original_pattern) {
    if (typeof pattern === "string" && pattern.substring(0, 1) === "!") {
      pattern = pattern.substring(1);
      this.is_strict = true;
    }
    if (pattern === "*" || pattern === "") {
      pattern = null;
    }
    const result = [];
    if (pattern != null) {
      for (const pair of pattern.split("&")) {
        let [key, val] = pair.split("=");
        key = key === "*" ? ".+" : key.replace(/\*/g, ".*");
        if (val == null || val === "") {
          val = "=?";
        } else {
          val = val === "*" ? "=?.*" : "=" + val.replace(/\*/g, ".*");
        }
        val = val.replace(/[\[\](){}]/g, "\\$&");
        result.push(key + val);
      }
    }
    this.compiled_patterns = result.map((p) => new RegExp("(^|\\&)" + p + "(\\&|$)"));
    if (this.is_strict) {
      const wrapped_patterns = result.map((p) => `(${p})`).join("|");
      this.strict_compiled_pattern = new RegExp("(^|\\&)(" + wrapped_patterns + ")(\\&|$)");
    }
    return result;
  }
  test(content = "", patterns = this.pattern) {
    let result = true;
    if (patterns != null) {
      if (this.is_strict && content === null && patterns.length === 0) {
        return true;
      }
      const useCache = patterns === this.pattern && this.compiled_patterns !== null;
      if (useCache && this.compiled_patterns) {
        for (const re of this.compiled_patterns) {
          if (!re.test(content)) {
            result = false;
            break;
          }
        }
      } else {
        for (const pattern of patterns) {
          const re = new RegExp("(^|\\&)" + pattern + "(\\&|$)");
          if (!re.test(content)) {
            result = false;
            break;
          }
        }
      }
      if (this.is_strict === true) {
        if (typeof content === "string") {
          if (useCache && this.strict_compiled_pattern) {
            for (const pair of content.split("&")) {
              if (!this.strict_compiled_pattern.test(pair)) {
                result = false;
                break;
              }
            }
          } else {
            const wrapped_patterns = patterns.map((p) => `(${p})`).join("|");
            const re = new RegExp("(^|\\&)(" + wrapped_patterns + ")(\\&|$)");
            for (const pair of content.split("&")) {
              if (!re.test(pair)) {
                result = false;
                break;
              }
            }
          }
        } else {
          result = false;
        }
      }
    }
    return result;
  }
}
if (module.exports.default) module.exports = module.exports.default;
