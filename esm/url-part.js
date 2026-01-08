class UrlPart {
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
}
export {
  UrlPart as default
};
