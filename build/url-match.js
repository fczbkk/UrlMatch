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

    UrlMatch.prototype.test = function(url) {
      var pattern, _i, _len, _ref;
      if (url == null) {
        url = '';
      }
      _ref = this._patterns;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pattern = _ref[_i];
        if (!pattern.validate(url)) {
          return false;
        }
      }
      return true;
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
      return !/^$|\*\*|\*[^\.]+|.\*|^(\.|-)|(\.|-)$|[^a-z0-9-.\*]/.test(pattern);
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
