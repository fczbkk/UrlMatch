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
  };

  // src/scheme.ts
  var Scheme = class extends UrlPart {
    validate(pattern = this.original_pattern) {
      if (pattern != null) {
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
        { substring: /\./g, replacement: "\\." },
        // replace asterisks with pattern
        { substring: /\*/g, replacement: "[a-z0-9-_.]+" }
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
        { substring: /\(/g, replacement: "\\(" },
        { substring: /\)/g, replacement: "\\)" },
        // assume trailing slash at the end of path is optional
        { substring: /\/$/, replacement: "\\/?" },
        { substring: /\/\*$/, replacement: "((/?)|/*)" },
        // plus sign
        { substring: /\+/g, replacement: "\\+" },
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
    "^(?<scheme>[a-z]+|\\*)*://(?:[^\\/\\#\\?]+@)*(?<host>[\\w\\*\\.\\-]+)*(?:\\:\\d+)*(?:/(?<path>[^\\?\\#]*))*(?:\\?(?<params>[^\\#]*))*(?:\\#(?<fragment>.*))*"
    // fragment: everything after # (optional)
  );
  var URL_PARTS = ["scheme", "host", "path", "params", "fragment"];
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
  };

  // src/index.ts
  var UrlMatch = class {
    constructor(patterns = []) {
      this.pattern_set = /* @__PURE__ */ new Set();
      this.pattern_cache = /* @__PURE__ */ new Map();
      this.add(patterns);
    }
    get patterns() {
      return Array.from(this.pattern_set);
    }
    add(patterns = []) {
      if (typeof patterns === "string") {
        patterns = [patterns];
      }
      for (const pattern of patterns) {
        if (!this.pattern_set.has(pattern)) {
          this.pattern_set.add(pattern);
          this.pattern_cache.set(pattern, new Pattern(pattern));
        }
      }
      return this.patterns;
    }
    remove(patterns = []) {
      if (typeof patterns === "string") {
        patterns = [patterns];
      }
      for (const pattern of patterns) {
        if (this.pattern_set.has(pattern)) {
          this.pattern_set.delete(pattern);
          this.pattern_cache.delete(pattern);
        }
      }
      return this.patterns;
    }
    test(content) {
      for (const pattern of this.pattern_set) {
        const pattern_obj = this.pattern_cache.get(pattern);
        if (pattern_obj && pattern_obj.test(content) === true) {
          return true;
        }
      }
      return false;
    }
    debug(content) {
      const result = {};
      for (const pattern of this.pattern_set) {
        const pattern_obj = this.pattern_cache.get(pattern);
        if (pattern_obj) {
          result[pattern] = pattern_obj.debug(content);
        }
      }
      return result;
    }
  };
  return __toCommonJS(index_exports);
})();
