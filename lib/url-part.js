'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _exists = require('./utilities/exists');

var _exists2 = _interopRequireDefault(_exists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(pattern) {
    _classCallCheck(this, _class);

    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
  }

  _createClass(_class, [{
    key: 'validate',
    value: function validate() {
      var pattern = arguments.length <= 0 || arguments[0] === undefined ? this.original_pattern : arguments[0];

      if ((0, _exists2.default)(pattern)) {
        var result = true;

        this.validate_rules.forEach(function (rule) {
          if (!rule.test(pattern)) {
            result = false;
          }
        });

        this.invalidate_rules.forEach(function (rule) {
          if (rule.test(pattern)) {
            result = false;
          }
        });

        return result;
      }

      return !this.is_required;
    }
  }, {
    key: 'test',
    value: function test() {
      var content = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var pattern = arguments.length <= 1 || arguments[1] === undefined ? this.pattern : arguments[1];

      if (content === null) {
        content = '';
      }

      if ((0, _exists2.default)(pattern)) {
        return pattern.test(content);
      }

      return true;
    }
  }, {
    key: 'sanitize',
    value: function sanitize() {
      var pattern = arguments.length <= 0 || arguments[0] === undefined ? this.original_pattern : arguments[0];

      if (!(0, _exists2.default)(pattern)) {
        pattern = this.default_value;
      }

      if ((0, _exists2.default)(pattern) && this.validate(pattern)) {
        this.sanitize_replacements.forEach(function (_ref) {
          var substring = _ref.substring;
          var replacement = _ref.replacement;

          pattern = pattern.replace(substring, replacement);
        });
        return new RegExp('^' + pattern + '$');
      }
      return null;
    }
  }, {
    key: 'default_value',
    get: function get() {
      return null;
    }
  }, {
    key: 'is_required',
    get: function get() {
      return true;
    }
  }, {
    key: 'validate_rules',
    get: function get() {
      return [];
    }
  }, {
    key: 'invalidate_rules',
    get: function get() {
      return [];
    }
  }, {
    key: 'sanitize_replacements',
    get: function get() {
      return [];
    }
  }]);

  return _class;
}();

exports.default = _class;