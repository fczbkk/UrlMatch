import UrlPart from "./url-part.js";
import exists from "./utilities/exists.js";
class Params extends UrlPart {
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
}
export {
  Params as default
};
