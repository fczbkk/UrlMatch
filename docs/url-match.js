"use strict";
var UrlMatch = (() => {
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

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    default: () => UrlMatch
  });

  // src/utilities/exists.ts
  function exists(val) {
    return typeof val !== "undefined" && val !== null;
  }

  // src/url-part.ts
  var UrlPart = class {
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
      if (exists(pattern)) {
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
      if (exists(pattern) && pattern instanceof RegExp) {
        return pattern.test(content);
      }
      return true;
    }
    get sanitize_replacements() {
      return [];
    }
    sanitize(pattern = this.original_pattern) {
      if (!exists(pattern)) {
        pattern = this.default_value;
      }
      if (exists(pattern) && this.validate(pattern)) {
        this.sanitize_replacements.forEach(({ substring, replacement }) => {
          pattern = pattern.replace(substring, replacement);
        });
        return new RegExp("^" + pattern + "$");
      }
      return null;
    }
  };

  // src/scheme.ts
  var Scheme = class extends UrlPart {
    validate(pattern = this.original_pattern) {
      if (exists(pattern)) {
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
  };

  // src/host.ts
  var Host = class extends UrlPart {
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
  };

  // src/path.ts
  var Path = class extends UrlPart {
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
  };

  // src/params.ts
  var Params = class extends UrlPart {
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
      if (exists(pattern)) {
        pattern.split("&").forEach((pair) => {
          let [key, val] = pair.split("=");
          key = key === "*" ? ".+" : key.replace(/\*/g, ".*");
          if (!exists(val) || val === "") {
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
      if (exists(patterns)) {
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
  };

  // src/fragment.ts
  var Fragment = class extends UrlPart {
    get is_required() {
      return false;
    }
    get invalidate_rules() {
      return [
        // must not contain hash
        /#/
      ];
    }
    get sanitize_replacements() {
      return [
        { substring: /\*/g, replacement: ".*" },
        { substring: /\?/g, replacement: "\\?" },
        { substring: /\//g, replacement: "\\/" }
      ];
    }
  };

  // src/pattern.ts
  var split_re = new RegExp(
    "^([a-z]+|\\*)*://([^\\/\\#\\?]+@)*([\\w\\*\\.\\-]+)*(\\:\\d+)*(/([^\\?\\#]*))*(\\?([^\\#]*))*(\\#(.*))*"
    // (9) fragment, (10) excluding hash
  );
  var parts_map = {
    scheme: 1,
    host: 3,
    path: 6,
    params: 8,
    fragment: 10
  };
  var Pattern = class {
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
      const parts = pattern.match(split_re);
      if (exists(parts) && parts !== null) {
        for (const key in parts_map) {
          const val = parts_map[key];
          result[key] = exists(parts[val]) ? parts[val] : empty_value;
        }
      }
      return result;
    }
    getUrlParts(pattern = this.pattern) {
      const splits = this.split(pattern);
      return {
        scheme: new Scheme(splits.scheme),
        host: new Host(splits.host),
        path: new Path(splits.path),
        params: new Params(splits.params),
        fragment: new Fragment(splits.fragment)
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
      let result = true;
      for (const key in url_parts) {
        const val = url_parts[key];
        if (!val.validate()) {
          result = false;
        }
      }
      return result;
    }
    test(url) {
      let result = false;
      if (exists(url)) {
        result = true;
        const splits = this.split(url);
        ["scheme", "host", "path", "params", "fragment"].forEach((part) => {
          if (!this.url_parts[part].test(splits[part])) {
            result = false;
          }
        });
      }
      return result;
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
  };

  // src/index.ts
  var UrlMatch = class {
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
        const pattern_obj = new Pattern(pattern);
        if (pattern_obj.test(content) === true) {
          result = true;
        }
      });
      return result;
    }
    debug(content) {
      const result = {};
      this.patterns.forEach((pattern) => {
        const pattern_obj = new Pattern(pattern);
        result[pattern] = pattern_obj.debug(content);
      });
      return result;
    }
  };
  return __toCommonJS(index_exports);
})();
