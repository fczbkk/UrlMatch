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
var url_part_exports = {};
__export(url_part_exports, {
  default: () => UrlPart
});
module.exports = __toCommonJS(url_part_exports);
var import_exists = __toESM(require("./utilities/exists.js"));
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
    if ((0, import_exists.default)(pattern)) {
      let result = true;
      this.validate_rules.forEach((rule) => {
        if (!rule.test(pattern)) {
          result = false;
        }
      });
      this.invalidate_rules.forEach((rule) => {
        if (rule.test(pattern)) {
          result = false;
        }
      });
      return result;
    }
    return !this.is_required;
  }
  test(content = "", pattern = this.pattern) {
    if (content === null) {
      content = "";
    }
    if ((0, import_exists.default)(pattern) && pattern instanceof RegExp) {
      return pattern.test(content);
    }
    return true;
  }
  get sanitize_replacements() {
    return [];
  }
  sanitize(pattern = this.original_pattern) {
    if (!(0, import_exists.default)(pattern)) {
      pattern = this.default_value;
    }
    if ((0, import_exists.default)(pattern) && this.validate(pattern)) {
      this.sanitize_replacements.forEach(({ substring, replacement }) => {
        pattern = pattern.replace(substring, replacement);
      });
      return new RegExp("^" + pattern + "$");
    }
    return null;
  }
}
if (module.exports.default) module.exports = module.exports.default;
