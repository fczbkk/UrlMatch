'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urlPart = require('./url-part');

var _urlPart2 = _interopRequireDefault(_urlPart);

var _exists = require('./utilities/exists');

var _exists2 = _interopRequireDefault(_exists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_UrlPart) {
  _inherits(_class, _UrlPart);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
  }

  _createClass(_class, [{
    key: 'sanitize',
    value: function sanitize() {
      var pattern = arguments.length <= 0 || arguments[0] === undefined ? this.original_pattern : arguments[0];

      if (pattern === '*') {
        pattern = null;
      }

      var result = {};

      if ((0, _exists2.default)(pattern)) {

        // replace asterisks
        pattern.split('&').forEach(function (pair) {
          var _pair$split = pair.split('=');

          var _pair$split2 = _slicedToArray(_pair$split, 2);

          var key = _pair$split2[0];
          var val = _pair$split2[1];

          // if key is asterisk, then at least one character is required

          key = key === '*' ? '.+' : key.replace(/\*/g, '.*');

          if (!(0, _exists2.default)(val) || val === '') {
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

          result[key] = val;
        });
      }

      return result;
    }
  }, {
    key: 'test',
    value: function test() {
      var content = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var pattern = arguments.length <= 1 || arguments[1] === undefined ? this.pattern : arguments[1];

      var result = true;

      if ((0, _exists2.default)(pattern)) {
        for (var key in pattern) {
          var val = pattern[key];
          var re = new RegExp('(^|\&)' + key + val + '(\&|$)');
          if (!re.test(content)) {
            result = false;
          }
        }
      }

      return result;
    }
  }, {
    key: 'is_required',
    get: function get() {
      return false;
    }
  }, {
    key: 'invalidate_rules',
    get: function get() {
      return [
      // two equal signs in a row
      /==/,
      // equal signs undivided by ampersand
      /=[^&]+=/,
      // single equal sign
      /^=$/];
    }
  }]);

  return _class;
}(_urlPart2.default);

exports.default = _class;