import Pattern from "./pattern.js";
class UrlMatch {
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
}
export {
  UrlMatch as default
};
