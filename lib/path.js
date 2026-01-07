"use strict";

exports.__esModule = true;
exports.default = void 0;
var _urlPart = _interopRequireDefault(require("./url-part"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class _default extends _urlPart.default {
  get default_value() {
    return '';
  }
  get sanitize_replacements() {
    return [
    // escape brackets
    {
      substring: /\(/,
      replacement: '\\\('
    }, {
      substring: /\)/,
      replacement: '\\\)'
    },
    // assume trailing slash at the end of path is optional
    {
      substring: /\/$/,
      replacement: '\\/?'
    }, {
      substring: /\/\*$/,
      replacement: '((\/?)|\/*)'
    },
    // plus sign
    {
      substring: /\+/,
      replacement: '\\\+'
    },
    // allow letters, numbers, plus signs, hyphens, dots, slashes
    // and underscores instead of wildcard
    {
      substring: /\*/g,
      replacement: '[a-zA-Z0-9\+-./_:~!$&\'\(\)\*,;=@%]*'
    }];
  }
}
exports.default = _default;