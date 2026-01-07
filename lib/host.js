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
var host_exports = {};
__export(host_exports, {
  default: () => Host
});
module.exports = __toCommonJS(host_exports);
var import_url_part = __toESM(require("./url-part.js"));
class Host extends import_url_part.default {
  get validate_rules() {
    return [
      // should not be empty
      /.+/
    ];
  }
  get invalidate_rules() {
    return [
      // two asterisks in a row
      /\*\*/,
      // asterisk not followed by a dot
      /\*[^\.]+/,
      // asterisk not at the beginning
      /.\*/,
      // starts with dot or hyphen
      /^(\.|-)/,
      // ends with dot or hyphen
      /(\.|-)$/,
      // anything except characters, numbers, hyphen, dot and asterisk
      /[^a-z0-9-.\*]/
    ];
  }
  get sanitize_replacements() {
    return [
      // make asterisk and dot at the beginning optional
      { substring: /^\*\./, replacement: "(*.)?" },
      // escape all dots
      { substring: ".", replacement: "\\." },
      // replace asterisks with pattern
      { substring: "*", replacement: "[a-z0-9-_.]+" }
    ];
  }
}
if (module.exports.default) module.exports = module.exports.default;
