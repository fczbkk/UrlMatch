(function() {
  var Host, Path, Pattern, Scheme, UrlFragment, UrlMatch, isArray, _ref, _ref1, _ref2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  UrlMatch = (function() {
    function UrlMatch(pattern) {
      this._patterns = [];
      this.addPattern(pattern);
    }

    UrlMatch.prototype.addPattern = function(pattern) {
      var item, patternObj, _i, _len;
      if (isArray(pattern)) {
        for (_i = 0, _len = pattern.length; _i < _len; _i++) {
          item = pattern[_i];
          this.addPattern(item);
        }
      }
      if (typeof pattern === 'string') {
        patternObj = new Pattern(pattern);
        if (patternObj.validate()) {
          return this._patterns.push(patternObj);
        }
      }
    };

    UrlMatch.prototype.removePattern = function(pattern) {
      var item, _i, _len;
      if (isArray(pattern)) {
        for (_i = 0, _len = pattern.length; _i < _len; _i++) {
          item = pattern[_i];
          this.removePattern(item);
        }
      }
      if (typeof pattern === 'string') {
        return this._patterns = this._patterns.filter(function(item) {
          return item.originalPattern !== pattern;
        });
      }
    };

    UrlMatch.prototype.test = function(url) {
      var pattern, _i, _len, _ref;
      if (url == null) {
        url = '';
      }
      _ref = this._patterns;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pattern = _ref[_i];
        if (pattern.test(url)) {
          return true;
        }
      }
      return false;
    };

    return UrlMatch;

  })();

  window.UrlMatch = UrlMatch;

  Pattern = (function() {
    Pattern.prototype._RE = /^([a-z]+|\*):\/\/(.+@)*([\w\*\.\-]+(\:\d+)*)(\/[^\?\#]*)/;

    function Pattern(originalPattern) {
      this.originalPattern = originalPattern != null ? originalPattern : '';
      this.parts = this.getParts(this.split(this.sanitize(this.originalPattern)));
    }

    Pattern.prototype.split = function(pattern) {
      var parts, result;
      if (pattern == null) {
        pattern = this.sanitize(this.originalPattern);
      }
      result = {
        scheme: '',
        host: '',
        path: ''
      };
      if (this._RE.test(pattern)) {
        parts = pattern.match(this._RE);
        result.scheme = parts != null ? parts[1] : void 0;
        result.host = parts != null ? parts[3] : void 0;
        result.path = parts != null ? parts[5] : void 0;
      }
      return result;
    };

    Pattern.prototype.getParts = function(fragments) {
      if (fragments == null) {
        fragments = (this.split(this.sanitize(this.originalPattern))) || {};
      }
      return {
        scheme: new Scheme(fragments.scheme),
        host: new Host(fragments.host),
        path: new Path(fragments.path)
      };
    };

    Pattern.prototype.sanitize = function(pattern) {
      if (pattern == null) {
        pattern = this.originalPattern;
      }
      if (pattern === '<all_urls>' || pattern === '*') {
        pattern = '*://*/*';
      }
      return pattern;
    };

    Pattern.prototype.validate = function(parts) {
      var _ref, _ref1, _ref2;
      if (parts == null) {
        parts = this.parts;
      }
      return ((_ref = parts.scheme) != null ? _ref.validate() : void 0) && ((_ref1 = parts.host) != null ? _ref1.validate() : void 0) && ((_ref2 = parts.path) != null ? _ref2.validate() : void 0);
    };

    Pattern.prototype.test = function(url, parts) {
      var fragments, _ref, _ref1, _ref2;
      if (url == null) {
        url = '';
      }
      if (parts == null) {
        parts = this.parts;
      }
      if (fragments = this.split(url)) {
        return ((_ref = parts.scheme) != null ? _ref.test(fragments.scheme) : void 0) && ((_ref1 = parts.host) != null ? _ref1.test(fragments.host) : void 0) && ((_ref2 = parts.path) != null ? _ref2.test(fragments.path) : void 0);
      } else {
        return false;
      }
    };

    return Pattern;

  })();

  UrlFragment = (function() {
    UrlFragment.prototype._sanitation = {};

    UrlFragment.prototype._validationRequire = [];

    UrlFragment.prototype._validationReject = [];

    function UrlFragment(originalPattern) {
      this.originalPattern = originalPattern;
      this.pattern = this.sanitize(this.originalPattern);
    }

    UrlFragment.prototype.validate = function(pattern) {
      var result, rule, _i, _j, _len, _len1, _ref, _ref1;
      if (pattern == null) {
        pattern = this.originalPattern;
      }
      result = false;
      _ref = this._validationRequire;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        if (rule.test(pattern)) {
          result = true;
        }
      }
      _ref1 = this._validationReject;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        rule = _ref1[_j];
        if (rule.test(pattern)) {
          result = false;
        }
      }
      return result;
    };

    UrlFragment.prototype.sanitize = function(pattern) {
      var key, val, _ref;
      if (pattern == null) {
        pattern = this.originalPattern;
      }
      _ref = this._sanitation;
      for (key in _ref) {
        val = _ref[key];
        pattern = pattern.replace(val, key);
      }
      return pattern;
    };

    UrlFragment.prototype.test = function(part, pattern) {
      if (pattern == null) {
        pattern = this.pattern;
      }
      return RegExp("" + pattern).test(part);
    };

    return UrlFragment;

  })();

  Scheme = (function(_super) {
    __extends(Scheme, _super);

    function Scheme() {
      _ref = Scheme.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Scheme.prototype._validationRequire = [/^([a-z]+|\*)$/];

    Scheme.prototype._sanitation = {
      'https?': '*'
    };

    return Scheme;

  })(UrlFragment);

  Host = (function(_super) {
    __extends(Host, _super);

    function Host() {
      _ref1 = Host.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Host.prototype._validationRequire = [/.+/];

    Host.prototype._validationReject = [/\*\*/, /\*[^\.]+/, /.\*/, /^(\.|-)/, /(\.|-)$/, /[^a-z0-9-.\*]/];

    Host.prototype._sanitation = {
      '[a-z0-9-.]+': '*'
    };

    return Host;

  })(UrlFragment);

  Path = (function(_super) {
    __extends(Path, _super);

    function Path() {
      _ref2 = Path.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Path.prototype._validationRequire = [/^\//];

    Path.prototype._sanitation = {
      '(/*|$)': /(?!^)\/\*$/,
      '[a-z0-9-./]*': /\*/g
    };

    return Path;

  })(UrlFragment);

  isArray = function(value) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  };

}).call(this);
