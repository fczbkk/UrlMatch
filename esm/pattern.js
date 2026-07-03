import Scheme from "./scheme.js";
import Host from "./host.js";
import Port from "./port.js";
import Path from "./path.js";
import Params from "./params.js";
import Fragment from "./fragment.js";
const split_re = new RegExp(
  "^(?<scheme>[a-zA-Z]+|\\*)?://(?:[^\\/\\#\\?]+@)?(?<host>[\\w\\*\\.\\-]+)?(?:\\:(?<port>[\\d\\*]+))?(?:/(?<path>[^\\?\\#]*))?(?:\\?(?<params>[^\\#]*))?(?:\\#(?<fragment>.*))?$"
  // End of string
);
const URL_PARTS = ["scheme", "host", "port", "path", "params", "fragment"];
const DEFAULT_PORTS = {
  http: "80",
  https: "443"
};
class Pattern {
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
}
export {
  Pattern as default
};
