/*
UrlMatch, v0.4.5
by Riki Fridrich
https://github.com/fczbkk/UrlMatch
*/
(function() {
  var Fragment, Host, Params, Path, Pattern, Scheme, UrlMatch, UrlPart, root,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Fragment = (function(superClass) {
    extend(Fragment, superClass);

    function Fragment() {
      return Fragment.__super__.constructor.apply(this, arguments);
    }

    Fragment.prototype.validate = function(pattern) {
      var i, invalidate_rules, len, result, rule;
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (pattern != null) {
        invalidate_rules = [/\#/];
        result = true;
        for (i = 0, len = invalidate_rules.length; i < len; i++) {
          rule = invalidate_rules[i];
          if (rule.test(pattern)) {
            result = false;
          }
        }
        return result;
      } else {
        return true;
      }
    };

    Fragment.prototype.sanitize = function(pattern) {
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (this.validate(pattern)) {
        if (pattern != null) {
          pattern = pattern.replace(/\*/g, '.*');
          return RegExp("^" + pattern + "$");
        }
      }
      return null;
    };

    return Fragment;

  })(UrlPart);

  Host = (function(superClass) {
    extend(Host, superClass);

    function Host() {
      return Host.__super__.constructor.apply(this, arguments);
    }

    Host.prototype.validate = function(pattern) {
      var i, invalidate_rules, j, len, len1, result, rule, validate_rules;
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (pattern != null) {
        validate_rules = [/.+/];
        invalidate_rules = [/\*\*/, /\*[^\.]+/, /.\*/, /^(\.|-)/, /(\.|-)$/, /[^a-z0-9-.\*]/];
        result = true;
        for (i = 0, len = validate_rules.length; i < len; i++) {
          rule = validate_rules[i];
          if (!rule.test(pattern)) {
            result = false;
          }
        }
        for (j = 0, len1 = invalidate_rules.length; j < len1; j++) {
          rule = invalidate_rules[j];
          if (rule.test(pattern)) {
            result = false;
          }
        }
        return result;
      } else {
        return false;
      }
    };

    Host.prototype.sanitize = function(pattern) {
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (this.validate(pattern)) {
        pattern = pattern.replace(/^\*\./, '(*.)?');
        pattern = pattern.replace('.', '\\.');
        pattern = pattern.replace('*', '[a-z0-9-.]+');
        return RegExp("^" + pattern + "$");
      } else {
        return null;
      }
    };

    return Host;

  })(UrlPart);

  Params = (function(superClass) {
    extend(Params, superClass);

    function Params() {
      return Params.__super__.constructor.apply(this, arguments);
    }

    Params.prototype.validate = function(pattern) {
      var i, invalidate_rules, len, result, rule;
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (pattern != null) {
        invalidate_rules = [/\=\=/, /\=[^\&]+\=/, /^\=$/];
        result = true;
        for (i = 0, len = invalidate_rules.length; i < len; i++) {
          rule = invalidate_rules[i];
          if (rule.test(pattern)) {
            result = false;
          }
        }
        return result;
      } else {
        return true;
      }
    };

    Params.prototype.sanitize = function(pattern) {
      var i, key, len, pair, ref, ref1, result, val;
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (pattern === '*') {
        pattern = null;
      }
      result = {};
      if (pattern != null) {
        ref = pattern.split('&');
        for (i = 0, len = ref.length; i < len; i++) {
          pair = ref[i];
          ref1 = pair.split('='), key = ref1[0], val = ref1[1];
          key = key === '*' ? '.+' : key.replace(/\*/g, '.*');
          if ((val == null) || (val === '')) {
            val = '=?';
          } else {
            val = val === '*' ? '=?.*' : '=' + val.replace(/\*/g, '.*');
          }
          val = val.replace(/[\[\](){}]/g, '\\$&');
          result[key] = val;
        }
      }
      return result;
    };

    Params.prototype.test = function(content, pattern) {
      var key, re, result, val;
      if (content == null) {
        content = '';
      }
      if (pattern == null) {
        pattern = this.pattern;
      }
      result = true;
      for (key in pattern) {
        val = pattern[key];
        re = RegExp("(^|\\&)" + key + val + "(\\&|$)");
        if (!re.test(content)) {
          result = false;
        }
      }
      return result;
    };

    return Params;

  })(UrlPart);

  Path = (function(superClass) {
    extend(Path, superClass);

    function Path() {
      return Path.__super__.constructor.apply(this, arguments);
    }

    Path.prototype.validate = function(pattern) {
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      return true;
    };

    Path.prototype.sanitize = function(pattern) {
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (pattern == null) {
        pattern = '';
      }
      pattern = pattern.replace(/\/$/, '\\/?');
      pattern = pattern.replace(/\/\*$/, '((\/?)|\/*)');
      pattern = pattern.replace(/\*/g, '[a-zA-Z0-9-./_]*');
      return RegExp("^" + pattern + "$");
    };

    return Path;

  })(UrlPart);

  Pattern = (function() {
    function Pattern(pattern) {
      var sanitized_pattern;
      if (pattern === '*' || pattern === '<all_urls>') {
        pattern = '*://*/*?*#*';
      }
      this.original_pattern = pattern;
      sanitized_pattern = this.sanitize(pattern);
      this.pattern = sanitized_pattern;
      this.url_parts = this.getUrlParts(sanitized_pattern);
    }

    Pattern.prototype.split_re = /^([a-z]+|\*)*:\/\/(.+@)*([\w\*\.\-]+)*(\:\d+)*(\/([^\?\#]*))*(\?([^\#]*))*(\#(.*))*/;

    Pattern.prototype.split = function(pattern, empty_value) {
      var key, parts, parts_map, result, val;
      if (pattern == null) {
        pattern = '';
      }
      if (empty_value == null) {
        empty_value = null;
      }
      parts = pattern.match(this.split_re);
      parts_map = {
        scheme: 1,
        host: 3,
        path: 6,
        params: 8,
        fragment: 10
      };
      result = {};
      for (key in parts_map) {
        val = parts_map[key];
        result[key] = (parts != null ? parts[val] : void 0) || empty_value;
      }
      return result;
    };

    Pattern.prototype.getUrlParts = function(pattern) {
      var splits;
      if (pattern == null) {
        pattern = this.pattern;
      }
      splits = this.split(pattern);
      return {
        scheme: new Scheme(splits.scheme),
        host: new Host(splits.host),
        path: new Path(splits.path),
        params: new Params(splits.params),
        fragment: new Fragment(splits.fragment)
      };
    };

    Pattern.prototype.sanitize = function(pattern) {
      var universal_pattern;
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      universal_pattern = '*://*/*?*#*';
      if (pattern === '*' || pattern === '<all_urls>') {
        pattern = universal_pattern;
      }
      return pattern;
    };

    Pattern.prototype.validate = function(url_parts) {
      var key, result, val;
      if (url_parts == null) {
        url_parts = this.url_parts;
      }
      result = true;
      for (key in url_parts) {
        val = url_parts[key];
        if (!val.validate()) {
          result = false;
        }
      }
      return result;
    };

    Pattern.prototype.test = function(url) {
      var i, len, part, ref, result, splits;
      if (url != null) {
        splits = this.split(url);
        result = true;
        ref = ['scheme', 'host', 'path', 'params', 'fragment'];
        for (i = 0, len = ref.length; i < len; i++) {
          part = ref[i];
          if (!this.url_parts[part].test(splits[part])) {
            result = false;
          }
        }
        return result;
      } else {
        return false;
      }
    };

    return Pattern;

  })();

  Scheme = (function(superClass) {
    extend(Scheme, superClass);

    function Scheme() {
      return Scheme.__super__.constructor.apply(this, arguments);
    }

    Scheme.prototype.validate = function(pattern) {
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (pattern != null) {
        return /^(\*|[a-z]+)$/.test(pattern);
      } else {
        return false;
      }
    };

    Scheme.prototype.sanitize = function(pattern) {
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (this.validate(pattern)) {
        pattern = pattern.replace('*', 'https?');
        return RegExp("^" + pattern + "$");
      } else {
        return null;
      }
    };

    return Scheme;

  })(UrlPart);

  UrlMatch = (function() {
    function UrlMatch(patterns) {
      if (patterns == null) {
        patterns = [];
      }
      this.patterns = [];
      this.add(patterns);
    }

    UrlMatch.prototype.add = function(patterns) {
      var i, len, pattern;
      if (patterns == null) {
        patterns = [];
      }
      if (typeof patterns === 'string') {
        patterns = [patterns];
      }
      for (i = 0, len = patterns.length; i < len; i++) {
        pattern = patterns[i];
        if (indexOf.call(this.patterns, pattern) < 0) {
          this.patterns.push(pattern);
        }
      }
      return this.patterns;
    };

    UrlMatch.prototype.remove = function(patterns) {
      if (patterns == null) {
        patterns = [];
      }
      if (typeof patterns === 'string') {
        patterns = [patterns];
      }
      return this.patterns = this.patterns.filter(function(item) {
        return indexOf.call(patterns, item) < 0;
      });
    };

    UrlMatch.prototype.test = function(content) {
      var i, len, pattern, pattern_obj, ref;
      ref = this.patterns;
      for (i = 0, len = ref.length; i < len; i++) {
        pattern = ref[i];
        pattern_obj = new Pattern(pattern);
        if (pattern_obj.test(content)) {
          return true;
        }
      }
      return false;
    };

    return UrlMatch;

  })();

  if (typeof expose !== "undefined" && expose !== null) {
    expose(UrlMatch, 'UrlMatch');
  } else {
    root = typeof exports === 'object' ? exports : this;
    root.UrlMatch = UrlMatch;
  }

  UrlPart = (function() {
    function UrlPart(pattern) {
      this.original_pattern = pattern;
      this.pattern = this.sanitize(pattern);
    }

    UrlPart.prototype.validate = function(pattern) {
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      return false;
    };

    UrlPart.prototype.test = function(content, pattern) {
      if (content == null) {
        content = '';
      }
      if (pattern == null) {
        pattern = this.pattern;
      }
      if (pattern != null) {
        return pattern.test(content);
      } else {
        return true;
      }
    };

    UrlPart.prototype.sanitize = function(pattern) {
      if (pattern == null) {
        pattern = this.original_pattern;
      }
      if (this.validatePattern) {
        return RegExp("^" + pattern + "$");
      } else {
        return null;
      }
    };

    return UrlPart;

  })();

}).call(this);
