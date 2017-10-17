'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urlPart = require('./url-part');

var _urlPart2 = _interopRequireDefault(_urlPart);

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

  _createClass(_class, [{
    key: 'default_value',
    get: function get() {
      return '';
    }
  }, {
    key: 'sanitize_replacements',
    get: function get() {
      return [
      // escape brackets
      { substring: /\(/, replacement: '\\\(' }, { substring: /\)/, replacement: '\\\)' },
      // assume trailing slash at the end of path is optional
      { substring: /\/$/, replacement: '\\/?' }, { substring: /\/\*$/, replacement: '((\/?)|\/*)' },
      // allow letters, numbers, hyphens, dots, slashes and underscores
      // instead of wildcard
      { substring: /\*/g, replacement: '[a-zA-Z0-9-./_:~!$&\'\(\)\*,;=@%]*' }];
    }
  }]);

  return _class;
}(_urlPart2.default);

exports.default = _class;