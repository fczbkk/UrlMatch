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
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_pattern = __toESM(require("./pattern"));
class index_default {
  constructor(patterns = []) {
    this.patterns = [];
    this.add(patterns);
  }
  add(patterns = []) {
    if (typeof patterns === "string") {
      patterns = [patterns];
    }
    patterns.forEach((pattern) => {
      if (this.patterns.indexOf(pattern) === -1) {
        this.patterns.push(pattern);
      }
    });
    return this.patterns;
  }
  remove(patterns = []) {
    if (typeof patterns === "string") {
      patterns = [patterns];
    }
    this.patterns = this.patterns.filter((pattern) => {
      return patterns.indexOf(pattern) === -1;
    });
    return this.patterns;
  }
  test(content) {
    let result = false;
    this.patterns.forEach((pattern) => {
      const pattern_obj = new import_pattern.default(pattern);
      if (pattern_obj.test(content) === true) {
        result = true;
      }
    });
    return result;
  }
  debug(content) {
    let result = {};
    this.patterns.forEach((pattern) => {
      const pattern_obj = new import_pattern.default(pattern);
      result[pattern] = pattern_obj.debug(content);
    });
    return result;
  }
}
