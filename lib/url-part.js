"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var url_part_exports = {};
__export(url_part_exports, {
  default: () => UrlPart
});
module.exports = __toCommonJS(url_part_exports);
class UrlPart {
  constructor(pattern) {
    this.is_strict = false;
    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
  }
  get default_value() {
    return null;
  }
  get is_required() {
    return true;
  }
  get validate_rules() {
    return [];
  }
  get invalidate_rules() {
    return [];
  }
  validate(pattern = this.original_pattern) {
    if (pattern != null) {
      for (const rule of this.validate_rules) {
        if (!rule.test(pattern)) {
          return false;
        }
      }
      for (const rule of this.invalidate_rules) {
        if (rule.test(pattern)) {
          return false;
        }
      }
      return true;
    }
    return !this.is_required;
  }
  test(content = "", pattern = this.pattern) {
    if (content === null) {
      content = "";
    }
    if (pattern != null && pattern instanceof RegExp) {
      return pattern.test(content);
    }
    return true;
  }
  get sanitize_replacements() {
    return [];
  }
  sanitize(pattern = this.original_pattern) {
    if (pattern == null) {
      pattern = this.default_value;
    }
    if (pattern != null && this.validate(pattern)) {
      for (const { substring, replacement } of this.sanitize_replacements) {
        pattern = pattern.replace(substring, replacement);
      }
      return new RegExp("^" + pattern + "$");
    }
    return null;
  }
}
if (module.exports.default) module.exports = module.exports.default;
