"use strict";

exports.__esModule = true;
exports.default = void 0;
var _pattern = _interopRequireDefault(require("./pattern"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class _default {
  constructor(patterns = []) {
    this.patterns = [];
    this.add(patterns);
  }
  add(patterns = []) {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }
    patterns.forEach(pattern => {
      if (this.patterns.indexOf(pattern) === -1) {
        this.patterns.push(pattern);
      }
    });
    return this.patterns;
  }
  remove(patterns = []) {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }
    this.patterns = this.patterns.filter(pattern => {
      return patterns.indexOf(pattern) === -1;
    });
    return this.patterns;
  }
  test(content) {
    let result = false;
    this.patterns.forEach(pattern => {
      const pattern_obj = new _pattern.default(pattern);
      if (pattern_obj.test(content) === true) {
        result = true;
      }
    });
    return result;
  }
  debug(content) {
    let result = {};
    this.patterns.forEach(pattern => {
      const pattern_obj = new _pattern.default(pattern);
      result[pattern] = pattern_obj.debug(content);
    });
    return result;
  }
}
exports.default = _default;