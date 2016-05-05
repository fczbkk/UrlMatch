'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

    return _possibleConstructorReturn(this, _UrlPart.apply(this, arguments));
  }

  _class.prototype.validate = function validate() {
    var pattern = arguments.length <= 0 || arguments[0] === undefined ? this.original_pattern : arguments[0];

    if ((0, _exists2.default)(pattern)) {
      var re = new RegExp('^(' + '\\*' + // single wildcard
      '|' + // or
      '[a-z]+' + // any string of lowercase letters
      ')$');
      return re.test(pattern);
    }
    return false;
  };

  _createClass(_class, [{
    key: 'sanitize_replacements',
    get: function get() {
      return [
      // when using wildcard, only match http(s)
      { substring: '*', replacement: 'https?' }];
    }
  }]);

  return _class;
}(_urlPart2.default);

exports.default = _class;