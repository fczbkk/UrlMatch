"use strict";

exports.__esModule = true;
exports.default = void 0;
var _urlPart = _interopRequireDefault(require("./url-part"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class _default extends _urlPart.default {
  get validate_rules() {
    return [
    // should not be empty
    /.+/];
  }
  get invalidate_rules() {
    return [
    // two asterisks in a row
    /\*\*/,
    // asterisk not followed by a dot
    /\*[^\.]+/,
    // asterisk not at the beginning
    /.\*/,
    // starts with dot or hyphen
    /^(\.|-)/,
    // ends with dot or hyphen
    /(\.|-)$/,
    // anything except characters, numbers, hyphen, dot and asterisk
    /[^a-z0-9-.\*]/];
  }
  get sanitize_replacements() {
    return [
    // make asterisk and dot at the beginning optional
    {
      substring: /^\*\./,
      replacement: '(*.)?'
    },
    // escape all dots
    {
      substring: '.',
      replacement: '\\.'
    },
    // replace asterisks with pattern
    {
      substring: '*',
      replacement: '[a-z0-9-_.]+'
    }];
  }
}
exports.default = _default;