import UrlPart from "./url-part.js";
class Scheme extends UrlPart {
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
}
export {
  Scheme as default
};
