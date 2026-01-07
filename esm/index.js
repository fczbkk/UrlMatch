import Pattern from "./pattern.js";
class UrlMatch {
  constructor(patterns = []) {
    this.patterns = [];
    this.patternCache = /* @__PURE__ */ new Map();
    this.add(patterns);
  }
  add(patterns = []) {
    if (typeof patterns === "string") {
      patterns = [patterns];
    }
    patterns.forEach((pattern) => {
      if (this.patterns.indexOf(pattern) === -1) {
        this.patterns.push(pattern);
        this.patternCache.set(pattern, new Pattern(pattern));
      }
    });
    return this.patterns;
  }
  remove(patterns = []) {
    if (typeof patterns === "string") {
      patterns = [patterns];
    }
    const patternsToRemove = new Set(patterns);
    this.patterns = this.patterns.filter((pattern) => {
      const shouldRemove = patternsToRemove.has(pattern);
      if (shouldRemove) {
        this.patternCache.delete(pattern);
      }
      return !shouldRemove;
    });
    return this.patterns;
  }
  test(content) {
    return this.patterns.some((pattern) => {
      const pattern_obj = this.patternCache.get(pattern);
      return pattern_obj ? pattern_obj.test(content) : false;
    });
  }
  debug(content) {
    const result = {};
    this.patterns.forEach((pattern) => {
      const pattern_obj = this.patternCache.get(pattern);
      if (pattern_obj) {
        result[pattern] = pattern_obj.debug(content);
      }
    });
    return result;
  }
}
export {
  UrlMatch as default
};
