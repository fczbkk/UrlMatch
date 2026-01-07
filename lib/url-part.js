"use strict";

exports.__esModule = true;
exports.default = void 0;
var _exists = _interopRequireDefault(require("./utilities/exists"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class _default {
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
    if ((0, _exists.default)(pattern)) {
      let result = true;
      this.validate_rules.forEach(rule => {
        if (!rule.test(pattern)) {
          result = false;
        }
      });
      this.invalidate_rules.forEach(rule => {
        if (rule.test(pattern)) {
          result = false;
        }
      });
      return result;
    }
    return !this.is_required;
  }
  test(content = '', pattern = this.pattern) {
    if (content === null) {
      content = '';
    }
    if ((0, _exists.default)(pattern)) {
      return pattern.test(content);
    }
    return true;
  }
  get sanitize_replacements() {
    return [];
  }
  sanitize(pattern = this.original_pattern) {
    if (!(0, _exists.default)(pattern)) {
      pattern = this.default_value;
    }
    if ((0, _exists.default)(pattern) && this.validate(pattern)) {
      this.sanitize_replacements.forEach(({
        substring,
        replacement
      }) => {
        pattern = pattern.replace(substring, replacement);
      });
      return new RegExp('^' + pattern + '$');
    }
    return null;
  }
}
exports.default = _default;