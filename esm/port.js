import UrlPart from "./url-part.js";
class Port extends UrlPart {
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
}
export {
  Port as default
};
