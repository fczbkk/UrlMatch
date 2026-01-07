import Scheme from "./scheme.js";
import Host from "./host.js";
import Path from "./path.js";
import Params from "./params.js";
import Fragment from "./fragment.js";
import exists from "./utilities/exists.js";
const split_re = new RegExp(
  "^([a-z]+|\\*)*://([^\\/\\#\\?]+@)*([\\w\\*\\.\\-]+)*(\\:\\d+)*(/([^\\?\\#]*))*(\\?([^\\#]*))*(\\#(.*))*"
  // (9) fragment, (10) excluding hash
);
const parts_map = {
  scheme: 1,
  host: 3,
  path: 6,
  params: 8,
  fragment: 10
};
class Pattern {
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
}
export {
  Pattern as default
};
