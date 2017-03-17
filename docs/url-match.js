var UrlMatch =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _pattern = __webpack_require__(1);

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

	  _class.prototype.add = function add() {
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
	  };

	  _class.prototype.remove = function remove() {
	    var patterns = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	    if (typeof patterns === 'string') {
	      patterns = [patterns];
	    }

	    this.patterns = this.patterns.filter(function (pattern) {
	      return patterns.indexOf(pattern) === -1;
	    });

	    return this.patterns;
	  };

	  _class.prototype.test = function test(content) {
	    var result = false;

	    this.patterns.forEach(function (pattern) {
	      var pattern_obj = new _pattern2.default(pattern);
	      if (pattern_obj.test(content) === true) {
	        result = true;
	      }
	    });

	    return result;
	  };

	  _class.prototype.debug = function debug(content) {
	    var result = {};

	    this.patterns.forEach(function (pattern) {
	      var pattern_obj = new _pattern2.default(pattern);
	      result[pattern] = pattern_obj.debug(content);
	    });

	    return result;
	  };

	  return _class;
	}();

	exports.default = _class;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _scheme = __webpack_require__(2);

	var _scheme2 = _interopRequireDefault(_scheme);

	var _host = __webpack_require__(5);

	var _host2 = _interopRequireDefault(_host);

	var _path = __webpack_require__(6);

	var _path2 = _interopRequireDefault(_path);

	var _params = __webpack_require__(7);

	var _params2 = _interopRequireDefault(_params);

	var _fragment = __webpack_require__(11);

	var _fragment2 = _interopRequireDefault(_fragment);

	var _exists = __webpack_require__(4);

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
	    var pattern = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	    var empty_value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	    var result = {};
	    var parts = pattern.match(split_re);

	    for (var key in parts_map) {
	      var val = parts_map[key];
	      result[key] = (0, _exists2.default)(parts) && (0, _exists2.default)(parts[val]) ? parts[val] : empty_value;
	    }

	    return result;
	  };

	  _class.prototype.getUrlParts = function getUrlParts() {
	    var pattern = arguments.length <= 0 || arguments[0] === undefined ? this.pattern : arguments[0];

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
	    var pattern = arguments.length <= 0 || arguments[0] === undefined ? this.original_pattern : arguments[0];

	    var universal_pattern = '*://*/*?*#*';
	    if (pattern === '*' || pattern === '<all_urls>') {
	      pattern = universal_pattern;
	    }
	    return pattern;
	  };

	  _class.prototype.validate = function validate() {
	    var url_parts = arguments.length <= 0 || arguments[0] === undefined ? this.url_parts : arguments[0];

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
	      (function () {
	        result = true;
	        var splits = _this.split(url);
	        ['scheme', 'host', 'path', 'params', 'fragment'].forEach(function (part) {
	          if (!_this.url_parts[part].test(splits[part])) {
	            result = false;
	          }
	        });
	      })();
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _urlPart = __webpack_require__(3);

	var _urlPart2 = _interopRequireDefault(_urlPart);

	var _exists = __webpack_require__(4);

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _exists = __webpack_require__(4);

	var _exists2 = _interopRequireDefault(_exists);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _class = function () {
	  function _class(pattern) {
	    _classCallCheck(this, _class);

	    this.is_strict = false;
	    this.original_pattern = pattern;
	    this.pattern = this.sanitize(pattern);
	  }

	  _class.prototype.validate = function validate() {
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
	  };

	  _class.prototype.test = function test() {
	    var content = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	    var pattern = arguments.length <= 1 || arguments[1] === undefined ? this.pattern : arguments[1];

	    if (content === null) {
	      content = '';
	    }

	    if ((0, _exists2.default)(pattern)) {
	      return pattern.test(content);
	    }

	    return true;
	  };

	  _class.prototype.sanitize = function sanitize() {
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
	  };

	  _createClass(_class, [{
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

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (val) {
	  return typeof val !== 'undefined' && val !== null;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _urlPart = __webpack_require__(3);

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
	    key: 'validate_rules',
	    get: function get() {
	      return [
	      // should not be empty
	      /.+/];
	    }
	  }, {
	    key: 'invalidate_rules',
	    get: function get() {
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
	  }, {
	    key: 'sanitize_replacements',
	    get: function get() {
	      return [
	      // make asterisk and dot at the beginning optional
	      { substring: /^\*\./, replacement: '(*.)?' },
	      // escape all dots
	      { substring: '.', replacement: '\\.' },
	      // replace asterisks with pattern
	      { substring: '*', replacement: '[a-z0-9-.]+' }];
	    }
	  }]);

	  return _class;
	}(_urlPart2.default);

	exports.default = _class;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _urlPart = __webpack_require__(3);

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
	      // assume trailing slash at the end of path is optional
	      { substring: /\/$/, replacement: '\\/?' }, { substring: /\/\*$/, replacement: '((\/?)|\/*)' },
	      // allow letters, numbers, hyphens, dots, slashes and underscores
	      // instead of wildcard
	      { substring: /\*/g, replacement: '[a-zA-Z0-9-./_]*' }];
	    }
	  }]);

	  return _class;
	}(_urlPart2.default);

	exports.default = _class;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _urlPart = __webpack_require__(3);

	var _urlPart2 = _interopRequireDefault(_urlPart);

	var _exists = __webpack_require__(4);

	var _exists2 = _interopRequireDefault(_exists);

	var _arrayReducePrototypejsFix = __webpack_require__(8);

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
	    var pattern = arguments.length <= 0 || arguments[0] === undefined ? this.original_pattern : arguments[0];

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

	        result.push(key + val);
	      });
	    }

	    return result;
	  };

	  _class.prototype.test = function test() {
	    var content = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	    var patterns = arguments.length <= 1 || arguments[1] === undefined ? this.pattern : arguments[1];

	    var result = true;

	    if ((0, _exists2.default)(patterns)) {

	      result = (0, _arrayReducePrototypejsFix2.default)(patterns, function (previous_result, pattern) {
	        var re = new RegExp('(^|\&)' + pattern + '(\&|$)');
	        return previous_result && re.test(content);
	      }, result);

	      if (this.is_strict === true) {
	        if (typeof content === 'string') {
	          (function () {
	            var wrapped_patterns = patterns.map(function (pattern) {
	              return '(' + pattern + ')';
	            }).join('|');
	            var re = new RegExp('(^|\&)(' + wrapped_patterns + ')(\&|$)');

	            result = (0, _arrayReducePrototypejsFix2.default)(content.split('&'), function (previous_result, pair) {
	              return previous_result && re.test(pair);
	            }, result);
	          })();
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = arrayReduce;

	var _getNestedProperty = __webpack_require__(9);

	var _getNestedProperty2 = _interopRequireDefault(_getNestedProperty);

	var _arrayReducePolyfill = __webpack_require__(10);

	var _arrayReducePolyfill2 = _interopRequireDefault(_arrayReducePolyfill);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	/**
	 * Checks whether PrototypeJS v1.6 or lower is present.
	 * @returns {boolean}
	 * @ignore
	 */
	function isOldPrototype() {
	  var prototype_version = (0, _getNestedProperty2.default)(window, 'Prototype.Version');

	  if (typeof prototype_version === 'string') {
	    var parts = prototype_version.split('.').map(function (item) {
	      return parseInt(item, 10);
	    });

	    if (parts[0] < 1 || parts[0] === 1 && parts[1] < 7) {
	      return true;
	    }
	  }

	  return false;
	}

	/**
	 * Does exactly the same as native `Array.reduce()`, but is safe to use when PrototypeJS v1.6 or lower is present.
	 * @param {Array} array Array object upon which you would call the native `reduce()` method.
	 * @param params Rest of parameters which you would provide to native `reduce()` method.
	 * @returns {*}
	 */
	function arrayReduce() {
	  var array = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	  var arrayReduce = isOldPrototype() ? _arrayReducePolyfill2.default : Array.prototype.reduce;

	  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    params[_key - 1] = arguments[_key];
	  }

	  return arrayReduce.apply(array, params);
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	};

	exports.default = getNestedProperty;
	/**
	 * Returns nested property by path.
	 * @param [data=window] Data object in which we will be looking for property.
	 * @param [path=''] Dot separated path to the nested property inside object.
	 * @returns {*} Found property of the object or `undefined` if not found.
	 *
	 * @example
	 * var data = {aaa: {bbb: 'ccc'}};
	 * getNestedProperty(data, 'aaa.bbb');
	 * // returns 'ccc'
	 */
	function getNestedProperty() {
	  var data = arguments.length <= 0 || arguments[0] === undefined ? window : arguments[0];
	  var path = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	  if (typeof path === 'string') {
	    var _ret = function () {

	      var result = data;

	      if (path !== '') {
	        path.split('.').forEach(function (segment) {
	          result = typeof result !== 'undefined' && typeof result[segment] !== 'undefined' ? result[segment] : undefined;
	        });
	      }

	      return {
	        v: result
	      };
	    }();

	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  } else {

	    throw new TypeError('getNestedProperty: Provided path must be String (is "' + path + '").');
	  }
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (callback /*, initialValue*/) // Array.reduce polyfill from:
	// https://gist.github.com/lski/0eae0d2738831b6b0ec2b88a8a603952

	{
	  'use strict';

	  if (this == null) {
	    throw new TypeError('Array.prototype.reduce called on null or undefined');
	  }
	  if (typeof callback !== 'function') {
	    throw new TypeError(callback + ' is not a function');
	  }
	  var t = Object(this),
	      len = t.length >>> 0,
	      k = 0,
	      value;
	  if (arguments.length == 2) {
	    value = arguments[1];
	  } else {
	    while (k < len && !(k in t)) {
	      k++;
	    }
	    if (k >= len) {
	      throw new TypeError('Reduce of empty array with no initial value');
	    }
	    value = t[k++];
	  }
	  for (; k < len; k++) {
	    if (k in t) {
	      value = callback(value, t[k], k, t);
	    }
	  }
	  return value;
	};

	;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _urlPart = __webpack_require__(3);

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
	    key: 'is_required',
	    get: function get() {
	      return false;
	    }
	  }, {
	    key: 'invalidate_rules',
	    get: function get() {
	      return [
	      // must not contain hash
	      /#/];
	    }
	  }, {
	    key: 'sanitize_replacements',
	    get: function get() {
	      return [{ substring: /\*/g, replacement: '.*' }, { substring: /\?/g, replacement: '\\\?' }, { substring: /\//g, replacement: '\\\/' }];
	    }
	  }]);

	  return _class;
	}(_urlPart2.default);

	exports.default = _class;

/***/ }
/******/ ]);