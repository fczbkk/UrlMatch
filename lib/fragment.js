"use strict";

exports.__esModule = true;
exports.default = void 0;
var _urlPart = _interopRequireDefault(require("./url-part"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class _default extends _urlPart.default {
  get is_required() {
    return false;
  }
  get invalidate_rules() {
    return [
    // must not contain hash
    /#/];
  }
  get sanitize_replacements() {
    return [{
      substring: /\*/g,
      replacement: '.*'
    }, {
      substring: /\?/g,
      replacement: '\\\?'
    }, {
      substring: /\//g,
      replacement: '\\\/'
    }];
  }
}
exports.default = _default;