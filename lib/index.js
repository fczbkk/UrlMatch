'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pattern = require('./pattern');

var _pattern2 = _interopRequireDefault(_pattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    var patterns = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, _class);

    this.patterns = [];
    this.add(patterns);
  }

  _createClass(_class, [{
    key: 'add',
    value: function add() {
      var _this = this;

      var patterns = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      if (typeof patterns === 'string') {
        patterns = [patterns];
      }

      patterns.forEach(function (pattern) {
        if (_this.patterns.indexOf(pattern) === -1) {
          _this.patterns.push(pattern);
        }
      });

      return this.patterns;
    }
  }, {
    key: 'remove',
    value: function remove() {
      var patterns = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      if (typeof patterns === 'string') {
        patterns = [patterns];
      }

      this.patterns = this.patterns.filter(function (pattern) {
        return patterns.indexOf(pattern) === -1;
      });

      return this.patterns;
    }
  }, {
    key: 'test',
    value: function test(content) {
      var result = false;

      this.patterns.forEach(function (pattern) {
        var pattern_obj = new _pattern2.default(pattern);
        if (pattern_obj.test(content) === true) {
          result = true;
        }
      });

      return result;
    }
  }]);

  return _class;
}();

exports.default = _class;