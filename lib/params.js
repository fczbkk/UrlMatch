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
  default: () => params_default
});
module.exports = __toCommonJS(params_exports);
var import_url_part = __toESM(require("./url-part"));
var import_exists = __toESM(require("./utilities/exists"));
class params_default extends import_url_part.default {
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
    if ((0, import_exists.default)(pattern)) {
      pattern.split("&").forEach((pair) => {
        let [key, val] = pair.split("=");
        key = key === "*" ? ".+" : key.replace(/\*/g, ".*");
        if (!(0, import_exists.default)(val) || val === "") {
          val = "=?";
        } else {
          val = val === "*" ? "=?.*" : "=" + val.replace(/\*/g, ".*");
        }
        val = val.replace(/[\[\](){}]/g, "\\$&");
        result.push(key + val);
      });
    }
    return result;
  }
  test(content = "", patterns = this.pattern) {
    let result = true;
    if ((0, import_exists.default)(patterns)) {
      if (this.is_strict && content === null && patterns.length === 0) {
        return true;
      }
      result = patterns.reduce((previous_result, pattern) => {
        const re = new RegExp("(^|&)" + pattern + "(&|$)");
        return previous_result && re.test(content);
      }, result);
      if (this.is_strict === true) {
        if (typeof content === "string") {
          const wrapped_patterns = patterns.map((pattern) => `(${pattern})`).join("|");
          const re = new RegExp("(^|&)(" + wrapped_patterns + ")(&|$)");
          result = content.split("&").reduce((previous_result, pair) => {
            return previous_result && re.test(pair);
          }, result);
        } else {
          result = false;
        }
      }
    }
    return result;
  }
}
