"use strict";

exports.__esModule = true;
exports.default = void 0;
var _urlPart = _interopRequireDefault(require("./url-part"));
var _exists = _interopRequireDefault(require("./utilities/exists"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class _default extends _urlPart.default {
  validate(pattern = this.original_pattern) {
    if ((0, _exists.default)(pattern)) {
      const re = new RegExp('^(' + '\\*' +
      // single wildcard
      '|' +
      // or
      '[a-z]+' +
      // any string of lowercase letters
      ')$');
      return re.test(pattern);
    }
    return false;
  }
  get sanitize_replacements() {
    return [
    // when using wildcard, only match http(s)
    {
      substring: '*',
      replacement: 'https?'
    }];
  }
}
exports.default = _default;