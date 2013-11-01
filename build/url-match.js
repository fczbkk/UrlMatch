(function() {
  var Host, Path, Pattern, Scheme, UrlMatch, isArray;

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
      return this._patterns = this._patterns.filter(function(item) {
        return item.originalPattern !== pattern;
      });
    };

    return UrlMatch;

  })();

  window.UrlMatch = UrlMatch;

  Pattern = (function() {
    Pattern.prototype._RE = /^([a-z]+|\*):\/\/(.+@)*([\w\*\.\-]+(\:\d+)*)(\/[^\?\#]*)/;

    function Pattern(originalPattern) {
      var _ref, _ref1, _ref2, _ref3;
      this.originalPattern = originalPattern;
      this.pattern = this.originalPattern;
      if ((_ref = this.pattern) === '<all_urls>' || _ref === '*') {
        this.pattern = '*://*/*';
      }
      if (this._RE.test(this.pattern)) {
        this.parts = this.pattern.match(this._RE);
        this.scheme = new Scheme((_ref1 = this.parts) != null ? _ref1[1] : void 0);
        this.host = new Host((_ref2 = this.parts) != null ? _ref2[3] : void 0);
        this.path = new Path((_ref3 = this.parts) != null ? _ref3[5] : void 0);
      }
    }

    Pattern.prototype.validate = function() {
      var _ref, _ref1, _ref2;
      return ((_ref = this.scheme) != null ? _ref.validate() : void 0) && ((_ref1 = this.host) != null ? _ref1.validate() : void 0) && ((_ref2 = this.path) != null ? _ref2.validate() : void 0);
    };

    return Pattern;

  })();

  Scheme = (function() {
    function Scheme(originalPattern) {
      this.originalPattern = originalPattern;
      this.pattern = this.sanitize(this.originalPattern);
    }

    Scheme.prototype.validate = function(pattern) {
      if (pattern == null) {
        pattern = this.originalPattern;
      }
      return /^([a-z]+|\*)$/.test(pattern);
    };

    Scheme.prototype.sanitize = function(pattern) {
      if (pattern == null) {
        pattern = this.originalPattern;
      }
      return pattern.replace('*', 'https?');
    };

    Scheme.prototype.test = function(scheme, pattern) {
      if (pattern == null) {
        pattern = this.pattern;
      }
      return RegExp("^" + pattern + "$").test(scheme);
    };

    return Scheme;

  })();

  Host = (function() {
    function Host(originalPattern) {
      this.originalPattern = originalPattern;
      this.pattern = this.sanitize(this.originalPattern);
    }

    Host.prototype.sanitize = function(pattern) {
      if (pattern == null) {
        pattern = this.originalPattern;
      }
      return pattern.replace('*', '[a-z0-9-.]+');
    };

    Host.prototype.validate = function(pattern) {
      if (pattern == null) {
        pattern = this.originalPattern;
      }
      return !/\*\*|\*[^\.]+|.\*|^(\.|-)|(\.|-)$|[^a-z0-9-.\*]/.test(pattern);
    };

    Host.prototype.test = function(host, pattern) {
      if (pattern == null) {
        pattern = this.pattern;
      }
      return RegExp("^" + pattern + "$").test(host);
    };

    return Host;

  })();

  Path = (function() {
    function Path(originalPattern) {
      this.originalPattern = originalPattern;
      this.pattern = this.sanitize(this.originalPattern);
    }

    Path.prototype.sanitize = function(pattern) {
      if (pattern == null) {
        pattern = this.originalPattern;
      }
      return pattern.replace(/(?!^)\/\*$/, '(/*|$)').replace(/\*/g, '[a-z0-9-./]*');
    };

    Path.prototype.validate = function(pattern) {
      if (pattern == null) {
        pattern = this.originalPattern;
      }
      return /^\//.test(pattern);
    };

    Path.prototype.test = function(path, pattern) {
      if (pattern == null) {
        pattern = this.pattern;
      }
      return RegExp("^" + pattern + "$").test(path);
    };

    return Path;

  })();

  isArray = function(value) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  };

}).call(this);
