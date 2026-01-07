"use strict";

exports.__esModule = true;
exports.default = void 0;
var _scheme = _interopRequireDefault(require("./scheme"));
var _host = _interopRequireDefault(require("./host"));
var _path = _interopRequireDefault(require("./path"));
var _params = _interopRequireDefault(require("./params"));
var _fragment = _interopRequireDefault(require("./fragment"));
var _exists = _interopRequireDefault(require("./utilities/exists"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const split_re = new RegExp('^' +
// beginning
'([a-z]+|\\*)*' +
// (1) scheme
'://' +
// scheme separator
'([^\\/\\#\\?]+@)*' +
// (2) username and/or password
'([\\w\\*\\.\\-]+)*' +
// (3) host
'(\\:\\d+)*' +
// (4) port number
'(/([^\\?\\#]*))*' +
// (5) path, (6) excluding slash
'(\\?([^\\#]*))*' +
// (7) params, (8) excluding question mark
'(\\#(.*))*' // (9) fragment, (10) excluding hash
);
const parts_map = {
  scheme: 1,
  host: 3,
  path: 6,
  params: 8,
  fragment: 10
};
class _default {
  constructor(pattern) {
    if (pattern === '*' || pattern === '<all_urls>') {
      pattern = '*://*/*?*#*';
    }
    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
    this.url_parts = this.getUrlParts(this.pattern);
  }
  split(pattern = '', empty_value = null) {
    const result = {};
    const parts = pattern.match(split_re);
    for (const key in parts_map) {
      const val = parts_map[key];
      result[key] = (0, _exists.default)(parts) && (0, _exists.default)(parts[val]) ? parts[val] : empty_value;
    }
    return result;
  }
  getUrlParts(pattern = this.pattern) {
    const splits = this.split(pattern);
    return {
      scheme: new _scheme.default(splits.scheme),
      host: new _host.default(splits.host),
      path: new _path.default(splits.path),
      params: new _params.default(splits.params),
      fragment: new _fragment.default(splits.fragment)
    };
  }
  sanitize(pattern = this.original_pattern) {
    const universal_pattern = '*://*/*?*#*';
    if (pattern === '*' || pattern === '<all_urls>') {
      pattern = universal_pattern;
    }
    return pattern;
  }
  validate(url_parts = this.url_parts) {
    let result = true;
    for (const key in url_parts) {
      const val = url_parts[key];
      if (!val.validate()) {
        result = false;
      }
    }
    return result;
  }
  test(url) {
    let result = false;
    if ((0, _exists.default)(url)) {
      result = true;
      const splits = this.split(url);
      ['scheme', 'host', 'path', 'params', 'fragment'].forEach(part => {
        if (!this.url_parts[part].test(splits[part])) {
          result = false;
        }
      });
    }
    return result;
  }
  debug(url) {
    const splits = this.split(url);
    const result = {};
    Object.keys(splits).forEach(key => {
      result[key] = {
        pattern: this.url_parts[key].original_pattern,
        value: splits[key],
        result: this.url_parts[key].test(splits[key])
      };
    });
    return result;
  }
}
exports.default = _default;