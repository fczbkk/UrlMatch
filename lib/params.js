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

var _arrayReducePrototypejsFix = require('array-reduce-prototypejs-fix');

var _arrayReducePrototypejsFix2 = _interopRequireDefault(_arrayReducePrototypejsFix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_UrlPart) {
  _inherits(_class, _UrlPart);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _UrlPart.apply(this, arguments));
  }

  _class.prototype.sanitize = function sanitize() {
    var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.original_pattern;

    // strict mode
    if (typeof pattern === 'string' && pattern.substring(0, 1) === '!') {
      pattern = pattern.substring(1);
      this.is_strict = true;
    }

    if (pattern === '*' || pattern === '') {
      pattern = null;
    }

    var result = [];

    if ((0, _exists2.default)(pattern)) {

      // replace asterisks
      pattern.split('&').forEach(function (pair) {
        var _pair$split = pair.split('='),
            _pair$split2 = _slicedToArray(_pair$split, 2),
            key = _pair$split2[0],
            val = _pair$split2[1];

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

        result.push(key + val);
      });
    }

    return result;
  };

  _class.prototype.test = function test() {
    var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var patterns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.pattern;

    var result = true;

    if ((0, _exists2.default)(patterns)) {

      // special case, when we want to strictly match no params, e.g. '*://*/*?!'
      if (this.is_strict && content === null && patterns.length === 0) {
        return true;
      }

      result = (0, _arrayReducePrototypejsFix2.default)(patterns, function (previous_result, pattern) {
        var re = new RegExp('(^|\&)' + pattern + '(\&|$)');
        return previous_result && re.test(content);
      }, result);

      if (this.is_strict === true) {
        if (typeof content === 'string') {
          var wrapped_patterns = patterns.map(function (pattern) {
            return '(' + pattern + ')';
          }).join('|');
          var re = new RegExp('(^|\&)(' + wrapped_patterns + ')(\&|$)');

          result = (0, _arrayReducePrototypejsFix2.default)(content.split('&'), function (previous_result, pair) {
            return previous_result && re.test(pair);
          }, result);
        } else {
          result = false;
        }
      }
    }

    return result;
  };

  _createClass(_class, [{
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