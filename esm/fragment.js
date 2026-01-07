import UrlPart from "./url-part.js";
class Fragment extends UrlPart {
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
}
export {
  Fragment as default
};
