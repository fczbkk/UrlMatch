import UrlPart from "./url-part.js";
class Path extends UrlPart {
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
}
export {
  Path as default
};
