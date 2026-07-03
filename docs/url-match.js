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
      return !this.is_required || this.default_value != null;
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
        // anything except characters, numbers, hyphen, dot, underscore
        // and asterisk
        /[^a-z0-9-._\*]/
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

  // src/port.ts
  var Port = class extends UrlPart {
    get is_required() {
      return false;
    }
    get validate_rules() {
      return [
        // digits and wildcards only, e.g. "8080", "*" or "3*"
        /^[\d\*]{1,5}$/
      ];
    }
    get invalidate_rules() {
      return [
        // two asterisks in a row
        /\*\*/
      ];
    }
    get sanitize_replacements() {
      return [
        // single wildcard requires a port number
        { substring: /^\*$/, replacement: "\\d+" },
        // partial wildcard matches any number of digits, e.g. "3*"
        // matches 3, 3000, 3001, etc.
        { substring: /\*/g, replacement: "\\d*" }
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
        // escape all RegExp metacharacters except the `*` wildcard
        // (`/` stays literal, it is not a metacharacter in RegExp constructor)
        { substring: /[.+?^${}()|[\]\\]/g, replacement: "\\$&" },
        // assume trailing slash at the end of path is optional
        { substring: /\/$/, replacement: "\\/?" },
        { substring: /\/\*$/, replacement: "((/?)|/*)" },
        // allow letters, numbers, plus signs, hyphens, dots, slashes
        // and underscores instead of wildcard
        { substring: /\*/g, replacement: "[a-zA-Z0-9+-./_:~!$&'()*,;=@%]*" }
      ];
    }
  };

  // src/params.ts
  function wildcardToRegExp(text) {
    return text.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\\/]/g, "\\$&")).join(".*");
  }
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
          key = key === "*" ? ".+" : wildcardToRegExp(key);
          if (val == null || val === "") {
            val = "=?";
          } else {
            val = val === "*" ? "=?.*" : "=" + wildcardToRegExp(val);
          }
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
        if (content === null) {
          content = "";
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
        // escape all RegExp metacharacters except the `*` wildcard
        { substring: /[.+?^${}()|[\]\\\/]/g, replacement: "\\$&" },
        { substring: /\*/g, replacement: ".*" }
      ];
    }
  };

  // src/pattern.ts
  var split_re = new RegExp(
    "^(?<scheme>[a-zA-Z]+|\\*)?://(?:[^\\/\\#\\?]+@)?(?<host>[\\w\\*\\.\\-]+)?(?:\\:(?<port>[\\d\\*]+))?(?:/(?<path>[^\\?\\#]*))?(?:\\?(?<params>[^\\#]*))?(?:\\#(?<fragment>.*))?$"
    // End of string
  );
  var URL_PARTS = ["scheme", "host", "port", "path", "params", "fragment"];
  var DEFAULT_PORTS = {
    http: "80",
    https: "443"
  };
  var Pattern = class {
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
        scheme: new Scheme(splits.scheme),
        host: new Host(splits.host),
        port: new Port(splits.port),
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
