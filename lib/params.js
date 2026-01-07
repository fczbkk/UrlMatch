"use strict";

exports.__esModule = true;
exports.default = void 0;
var _urlPart = _interopRequireDefault(require("./url-part"));
var _exists = _interopRequireDefault(require("./utilities/exists"));
var _arrayReducePrototypejsFix = _interopRequireDefault(require("array-reduce-prototypejs-fix"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class _default extends _urlPart.default {
  get is_required() {
    return false;
  }
  get invalidate_rules() {
    return [
    // two equal signs in a row
    /==/,
    // equal signs undivided by ampersand
    /=[^&]+=/,
    // single equal sign
    /^=$/];
  }
  sanitize(pattern = this.original_pattern) {
    // strict mode
    if (typeof pattern === 'string' && pattern.substring(0, 1) === '!') {
      pattern = pattern.substring(1);
      this.is_strict = true;
    }
    if (pattern === '*' || pattern === '') {
      pattern = null;
    }
    const result = [];
    if ((0, _exists.default)(pattern)) {
      // replace asterisks
      pattern.split('&').forEach(pair => {
        let [key, val] = pair.split('=');

        // if key is asterisk, then at least one character is required
        key = key === '*' ? '.+' : key.replace(/\*/g, '.*');
        if (!(0, _exists.default)(val) || val === '') {
          // if value is missing, it is prohibited
          // only equal sign is allowed
          val = '=?';
        } else {
          // if value match is universal, the value is optional
          // thus the equal sign is optional
          val = val === '*' ? '=?.*' : '=' + val.replace(/\*/g, '.*');
        }

        // escape all brackets
        val = val.replace(/[\[\](){}]/g, '\\$&');
        result.push(key + val);
      });
    }
    return result;
  }
  test(content = '', patterns = this.pattern) {
    let result = true;
    if ((0, _exists.default)(patterns)) {
      // special case, when we want to strictly match no params, e.g. '*://*/*?!'
      if (this.is_strict && content === null && patterns.length === 0) {
        return true;
      }
      result = (0, _arrayReducePrototypejsFix.default)(patterns, (previous_result, pattern) => {
        const re = new RegExp('(^|\&)' + pattern + '(\&|$)');
        return previous_result && re.test(content);
      }, result);
      if (this.is_strict === true) {
        if (typeof content === 'string') {
          const wrapped_patterns = patterns.map(pattern => `(${pattern})`).join('|');
          const re = new RegExp('(^|\&)(' + wrapped_patterns + ')(\&|$)');
          result = (0, _arrayReducePrototypejsFix.default)(content.split('&'), (previous_result, pair) => {
            return previous_result && re.test(pair);
          }, result);
        } else {
          result = false;
        }
      }
    }
    return result;
  }
}
exports.default = _default;