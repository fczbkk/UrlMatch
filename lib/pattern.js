'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scheme = require('./scheme');

var _scheme2 = _interopRequireDefault(_scheme);

var _host = require('./host');

var _host2 = _interopRequireDefault(_host);

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _params = require('./params');

var _params2 = _interopRequireDefault(_params);

var _fragment = require('./fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _exists = require('./utilities/exists');

var _exists2 = _interopRequireDefault(_exists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var split_re = new RegExp('^' + // beginning
'([a-z]+|\\*)*' + // (1) scheme
'://' + // scheme separator
'([^\\/\\#\\?]+@)*' + // (2) username and/or password
'([\\w\\*\\.\\-]+)*' + // (3) host
'(\\:\\d+)*' + // (4) port number
'(/([^\\?\\#]*))*' + // (5) path, (6) excluding slash
'(\\?([^\\#]*))*' + // (7) params, (8) excluding question mark
'(\\#(.*))*' // (9) fragment, (10) excluding hash
);

var parts_map = {
  scheme: 1,
  host: 3,
  path: 6,
  params: 8,
  fragment: 10
};

var _class = function () {
  function _class(pattern) {
    _classCallCheck(this, _class);

    if (pattern === '*' || pattern === '<all_urls>') {
      pattern = '*://*/*?*#*';
    }

    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
    this.url_parts = this.getUrlParts(this.pattern);
  }

  _class.prototype.split = function split() {
    var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var empty_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var result = {};
    var parts = pattern.match(split_re);

    for (var key in parts_map) {
      var val = parts_map[key];
      result[key] = (0, _exists2.default)(parts) && (0, _exists2.default)(parts[val]) ? parts[val] : empty_value;
    }

    return result;
  };

  _class.prototype.getUrlParts = function getUrlParts() {
    var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.pattern;

    var splits = this.split(pattern);
    return {
      scheme: new _scheme2.default(splits.scheme),
      host: new _host2.default(splits.host),
      path: new _path2.default(splits.path),
      params: new _params2.default(splits.params),
      fragment: new _fragment2.default(splits.fragment)
    };
  };

  _class.prototype.sanitize = function sanitize() {
    var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.original_pattern;

    var universal_pattern = '*://*/*?*#*';
    if (pattern === '*' || pattern === '<all_urls>') {
      pattern = universal_pattern;
    }
    return pattern;
  };

  _class.prototype.validate = function validate() {
    var url_parts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.url_parts;

    var result = true;

    for (var key in url_parts) {
      var val = url_parts[key];
      if (!val.validate()) {
        result = false;
      }
    }

    return result;
  };

  _class.prototype.test = function test(url) {
    var _this = this;

    var result = false;

    if ((0, _exists2.default)(url)) {
      result = true;
      var splits = this.split(url);
      ['scheme', 'host', 'path', 'params', 'fragment'].forEach(function (part) {
        if (!_this.url_parts[part].test(splits[part])) {
          result = false;
        }
      });
    }

    return result;
  };

  _class.prototype.debug = function debug(url) {
    var _this2 = this;

    var splits = this.split(url);
    var result = {};

    Object.keys(splits).forEach(function (key) {
      result[key] = {
        pattern: _this2.url_parts[key].original_pattern,
        value: splits[key],
        result: _this2.url_parts[key].test(splits[key])
      };
    });

    return result;
  };

  return _class;
}();

exports.default = _class;