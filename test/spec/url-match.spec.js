(function() {
  describe('URL Match', function() {
    var complex_url, url_match;
    url_match = null;
    complex_url = 'http://user:pass@aaa.bbb.ccc:8080/ddd/eee?fff=ggg&hhh=iii#jjj';
    beforeEach(function() {
      return url_match = new UrlMatch();
    });
    it('should exist', function() {
      return expect(UrlMatch).toBeDefined();
    });
    describe('add patterns', function() {
      it('should be created without a pattern', function() {
        return expect(url_match.patterns.length).toBe(0);
      });
      it('should be created with single pattern', function() {
        url_match = new UrlMatch('*');
        return expect(url_match.patterns.length).toBe(1);
      });
      it('should be created with multiple patterns', function() {
        var patterns;
        patterns = ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*'];
        url_match = new UrlMatch(patterns);
        return expect(url_match.patterns.length).toBe(3);
      });
      it('should add single pattern', function() {
        url_match.add('*');
        return expect(url_match.patterns.length).toBe(1);
      });
      it('should add multiple patterns', function() {
        url_match.add(['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*']);
        return expect(url_match.patterns.length).toBe(3);
      });
      return it('should only add unique patterns', function() {
        url_match = new UrlMatch(['*', '*', '*']);
        return expect(url_match.patterns.length).toBe(1);
      });
    });
    describe('remove patterns', function() {
      beforeEach(function() {
        var patterns;
        patterns = ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*'];
        return url_match = new UrlMatch(patterns);
      });
      it('should remove single pattern', function() {
        url_match.remove('*://aaa.bbb/*');
        return expect(url_match.patterns.length).toBe(2);
      });
      it('should remove multiple patterns', function() {
        url_match.remove(['*://aaa.bbb/*', '*://ccc.ddd/*']);
        return expect(url_match.patterns.length).toBe(1);
      });
      return it('should ignore removing of non-existing patterns', function() {
        url_match.remove('*://ggg.hhh/*');
        return expect(url_match.patterns.length).toBe(3);
      });
    });
    describe('matching', function() {
      it('should match URL against a pattern', function() {
        var pattern, patterns, _i, _len, _results;
        patterns = ['*', '*://*/*?*#*', 'http://*/*?*#*', '*://aaa.bbb.ccc/*?*#*', '*://*/ddd/eee?*#*', '*://*/*?fff=ggg&hhh=iii#*', '*://*/*?*#jjj', complex_url];
        _results = [];
        for (_i = 0, _len = patterns.length; _i < _len; _i++) {
          pattern = patterns[_i];
          url_match = new UrlMatch(pattern);
          _results.push(expect(url_match.test(complex_url)).toBe(true));
        }
        return _results;
      });
      return it('should match URL against all of multiple patterns', function() {
        var patterns;
        patterns = ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*'];
        url_match = new UrlMatch(patterns);
        expect(url_match.test('http://aaa.bbb/ccc')).toBe(true);
        return expect(url_match.test('http://xxx.yyy/zzz')).toBe(false);
      });
    });
    describe('Pattern', function() {
      var pattern;
      pattern = null;
      beforeEach(function() {
        return pattern = new UrlMatch.Pattern();
      });
      describe('split', function() {
        it('should use null for missing parts', function() {
          var result;
          result = pattern.split('*://*/*');
          expect(result.params).toEqual(null);
          return expect(result.fragment).toEqual(null);
        });
        it('should use custom value for missing parts', function() {
          var result;
          result = pattern.split('*://*/*', '*');
          expect(result.params).toEqual('*');
          return expect(result.fragment).toEqual('*');
        });
        it('should split into correct parts', function() {
          var result;
          result = pattern.split('*://*/*?*#*');
          expect(result.scheme).toEqual('*');
          expect(result.host).toEqual('*');
          expect(result.path).toEqual('*');
          expect(result.params).toEqual('*');
          return expect(result.fragment).toEqual('*');
        });
        return it('should split pattern into correct parts', function() {
          var result;
          result = pattern.split(complex_url);
          expect(result.scheme).toEqual('http');
          expect(result.host).toEqual('aaa.bbb.ccc');
          expect(result.path).toEqual('ddd/eee');
          expect(result.params).toEqual('fff=ggg&hhh=iii');
          return expect(result.fragment).toEqual('jjj');
        });
      });
      describe('getUrlParts', function() {
        var part, url_parts, _i, _len, _ref, _results;
        url_parts = null;
        beforeEach(function() {
          return url_parts = pattern.getUrlParts('*://*/*?*#*');
        });
        _ref = ['Scheme', 'Host', 'Path', 'Params', 'Fragment'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          part = _ref[_i];
          _results.push(it("should get correct " + part, function() {
            var obj, obj_re, url_parts_re;
            obj = new UrlMatch[part]('*');
            url_parts_re = url_parts[part.toLowerCase()].pattern.toString();
            obj_re = obj.pattern.toString();
            return expect(url_parts_re).toEqual(obj_re);
          }));
        }
        return _results;
      });
      describe('validate', function() {
        var validatePattern;
        validatePattern = function(content, expected_value) {
          var url_parts;
          if (content == null) {
            content = '';
          }
          if (expected_value == null) {
            expected_value = true;
          }
          url_parts = pattern.getUrlParts(content);
          return expect(pattern.validate(url_parts)).toBe(expected_value);
        };
        describe('valid patterns', function() {
          it('should validate universal pattern', function() {
            return validatePattern('*://*/*?*#*', true);
          });
          it('should validate pattern with empty path', function() {
            return validatePattern('*://*/', true);
          });
          it('should validate pattern with just scheme, host and path', function() {
            validatePattern('*://*/*', true);
            return validatePattern('http://aaa.bbb/ccc', true);
          });
          it('should validate pattern with params', function() {
            return validatePattern('*://*/*?aaa=bbb', true);
          });
          it('should validate pattern with fragment', function() {
            return validatePattern('*://*/*#aaa', true);
          });
          return it('should validate full pattern', function() {
            validatePattern('*://*/*?*#*', true);
            return validatePattern(complex_url, true);
          });
        });
        describe('incomplete patterns', function() {
          it('should not validate pattern without scheme', function() {
            validatePattern('*/*', false);
            validatePattern('://*/*', false);
            validatePattern('://aaa.bbb/', false);
            return validatePattern('aaa.bbb/', false);
          });
          return it('should not validate pattern without host', function() {
            validatePattern('*:///*', false);
            return validatePattern('http:///aaa', false);
          });
        });
        return describe('invalid patterns', function() {
          it('should not validate pattern with invalid scheme', function() {
            validatePattern('http//*/*', false);
            validatePattern('http:/*/*', false);
            validatePattern('http:*/*', false);
            return validatePattern('http*/*', false);
          });
          it('should not validate pattern with invalid host', function() {
            validatePattern('http://**/*', false);
            validatePattern('http://aaa*bbb/*', false);
            return validatePattern('http://aaa.*/*', false);
          });
          it('should not validate pattern with invalid params', function() {
            validatePattern('*://*/*?aaa==bbb', false);
            validatePattern('*://*/*?aaa=bbb=ccc', false);
            return validatePattern('*://*/*?=', false);
          });
          return it('should not validate pattern with invalid fragment', function() {
            validatePattern('*://*/*##', false);
            validatePattern('*://*/*##aaa', false);
            validatePattern('*://*/*#aaa#', false);
            return validatePattern('*://*/*#aaa#bbb', false);
          });
        });
      });
      describe('sanitize', function() {
        it('should convert single asterisk to universal match pattern', function() {
          pattern = new UrlMatch.Pattern('*');
          return expect(pattern.original_pattern).toEqual('*://*/*?*#*');
        });
        return it('should convert `<all_urls>` to universal match pattern', function() {
          pattern = new UrlMatch.Pattern('<all_urls>');
          return expect(pattern.original_pattern).toEqual('*://*/*?*#*');
        });
      });
      return describe('match', function() {
        it('should match any URL', function() {
          pattern = new UrlMatch.Pattern('*://*/*?*#*');
          return expect(pattern.test(complex_url)).toBe(true);
        });
        it('should match correct scheme', function() {
          pattern = new UrlMatch.Pattern('http://*/*?*#*');
          return expect(pattern.test(complex_url)).toBe(true);
        });
        it('should match correct host', function() {
          pattern = new UrlMatch.Pattern('*://aaa.bbb.ccc/*?*#*');
          return expect(pattern.test(complex_url)).toBe(true);
        });
        it('should match correct path', function() {
          pattern = new UrlMatch.Pattern('*://*/ddd/eee?*#*');
          return expect(pattern.test(complex_url)).toBe(true);
        });
        it('should match correct params', function() {
          pattern = new UrlMatch.Pattern('*://*/*?fff=ggg&hhh=iii#*');
          return expect(pattern.test(complex_url)).toBe(true);
        });
        it('should match correct fragment', function() {
          pattern = new UrlMatch.Pattern('*://*/*?*#jjj');
          return expect(pattern.test(complex_url)).toBe(true);
        });
        it('should match exact URL', function() {
          pattern = new UrlMatch.Pattern(complex_url);
          return expect(pattern.test(complex_url)).toBe(true);
        });
        return it('should match pattern without path correctly', function() {
          pattern = new UrlMatch.Pattern('*://aaa.bbb/');
          expect(pattern.test('http://aaa.bbb/')).toBe(true);
          return expect(pattern.test('http://aaa.bbb/ccc')).toBe(false);
        });
      });
    });
    describe('Scheme', function() {
      var scheme;
      scheme = null;
      beforeEach(function() {
        return scheme = new UrlMatch.Scheme();
      });
      describe('validation', function() {
        it('should not validate if empty', function() {
          expect(scheme.validate()).toBe(false);
          return expect(scheme.validate('')).toBe(false);
        });
        it('should validate asterisk', function() {
          return expect(scheme.validate('*')).toBe(true);
        });
        it('should not validate more than one asterisk', function() {
          var pattern, schemes, _i, _len, _results;
          schemes = ['**', '*a*', '**a', 'a**', 'a**b', '*a*b', 'a*b*', 'a*b*c'];
          _results = [];
          for (_i = 0, _len = schemes.length; _i < _len; _i++) {
            pattern = schemes[_i];
            _results.push(expect(scheme.validate(pattern)).toBe(false));
          }
          return _results;
        });
        it('should validate string of characters', function() {
          var pattern, schemes, _i, _len, _results;
          schemes = ['aaa', 'http', 'https'];
          _results = [];
          for (_i = 0, _len = schemes.length; _i < _len; _i++) {
            pattern = schemes[_i];
            _results.push(expect(scheme.validate(pattern)).toBe(true));
          }
          return _results;
        });
        it('should not validate numbers', function() {
          var pattern, schemes, _i, _len, _results;
          schemes = ['123', 'aaa123', '123bbb', 'aaa123bbb'];
          _results = [];
          for (_i = 0, _len = schemes.length; _i < _len; _i++) {
            pattern = schemes[_i];
            _results.push(expect(scheme.validate(pattern)).toBe(false));
          }
          return _results;
        });
        return it('should not validate special characters', function() {
          var pattern, schemes, _i, _len, _results;
          schemes = ['-', '?', '!', 'aaa-', '-aaa', 'aaa-bbb'];
          _results = [];
          for (_i = 0, _len = schemes.length; _i < _len; _i++) {
            pattern = schemes[_i];
            _results.push(expect(scheme.validate(pattern)).toBe(false));
          }
          return _results;
        });
      });
      describe('sanitize', function() {
        it('should sanitize *', function() {
          return expect(scheme.sanitize('*')).toEqual(/^https?$/);
        });
        return it('should sanitize custom protocol', function() {
          expect(scheme.sanitize('http')).toEqual(/^http$/);
          return expect(scheme.sanitize('https')).toEqual(/^https$/);
        });
      });
      return describe('test', function() {
        it('should match only specific scheme when provided', function() {
          var invalid_pairs, key, val, _i, _len, _results;
          invalid_pairs = {
            'aaa': 'aaaaaa',
            'aaa': 'aaabbb',
            'aaa': 'bbbaaa',
            'aaa': 'bbb'
          };
          _results = [];
          for (val = _i = 0, _len = invalid_pairs.length; _i < _len; val = ++_i) {
            key = invalid_pairs[val];
            _results.push(expect(scheme.test(key, val)).toBe(false));
          }
          return _results;
        });
        return it('should only match `http` or `https` on universal pattern', function() {
          var pattern;
          pattern = scheme.sanitize('*');
          expect(scheme.test('http', pattern)).toBe(true);
          expect(scheme.test('https', pattern)).toBe(true);
          return expect(scheme.test('aaa', pattern)).toBe(false);
        });
      });
    });
    describe('Host', function() {
      var host;
      host = null;
      beforeEach(function() {
        return host = new UrlMatch.Host();
      });
      describe('validate', function() {
        it('should not validate if empty', function() {
          expect(host.validate()).toBe(false);
          return expect(host.validate('')).toBe(false);
        });
        it('should validate asterisk', function() {
          return expect(host.validate('*')).toBe(true);
        });
        it('should not validate multiple asterisks', function() {
          var hosts, pattern, _i, _len, _results;
          hosts = ['**', '**.aaa', '**.aaa.bbb'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            pattern = hosts[_i];
            _results.push(expect(host.validate(pattern)).toBe(false));
          }
          return _results;
        });
        it('should validate domain without subdomain', function() {
          var hosts, pattern, _i, _len, _results;
          hosts = ['aaa.bbb'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            pattern = hosts[_i];
            _results.push(expect(host.validate(pattern)).toBe(true));
          }
          return _results;
        });
        it('should validate domain with any level of subdomains', function() {
          var hosts, pattern, _i, _len, _results;
          hosts = ['aaa.bbb.ccc', 'aaa.bbb.ccc.ddd'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            pattern = hosts[_i];
            _results.push(expect(host.validate(pattern)).toBe(true));
          }
          return _results;
        });
        it('should validate asterisk at the beginning of domain', function() {
          var hosts, pattern, _i, _len, _results;
          hosts = ['*.aaa', '*.aaa.bbb'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            pattern = hosts[_i];
            _results.push(expect(host.validate(pattern)).toBe(true));
          }
          return _results;
        });
        it('should not validate if asterisk is not followed by a dot', function() {
          var hosts, pattern, _i, _len, _results;
          hosts = ['*aaa', '*aaa.bbb'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            pattern = hosts[_i];
            _results.push(expect(host.validate(pattern)).toBe(false));
          }
          return _results;
        });
        it('should not validate if asterisk is not at the beginning', function() {
          var hosts, pattern, _i, _len, _results;
          hosts = ['aaa*', 'aaa*bbb'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            pattern = hosts[_i];
            _results.push(expect(host.validate(pattern)).toBe(false));
          }
          return _results;
        });
        it('should not validate characters except letters, numbers and -', function() {
          var hosts, pattern, _i, _len, _results;
          hosts = ['aaa?bbb.ccc', 'aaa_bbb.ccc', 'aaa+bbb.ccc'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            pattern = hosts[_i];
            _results.push(expect(host.validate(pattern)).toBe(false));
          }
          return _results;
        });
        return it('should not validate when starts or ends with dot or hyphen', function() {
          var hosts, pattern, _i, _len, _results;
          hosts = ['-aaa.bbb', '.aaa.bbb', 'aaa.bbb-', 'aaa.bbb.'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            pattern = hosts[_i];
            _results.push(expect(host.validate(pattern)).toBe(false));
          }
          return _results;
        });
      });
      describe('sanitize', function() {
        it('should sanitize *', function() {
          return expect(host.sanitize('*')).toEqual(/^[a-z0-9-.]+$/);
        });
        it('should sanitize host without asterisk', function() {
          return expect(host.sanitize('aaa')).toEqual(/^aaa$/);
        });
        return it('should sanitize host with asterisk', function() {
          return expect(host.sanitize('*.aaa')).toEqual(/^[a-z0-9-.]+\.aaa$/);
        });
      });
      return describe('match', function() {
        it('should match any host when * is used', function() {
          var hosts, item, pattern, _i, _len, _results;
          pattern = host.sanitize('*');
          hosts = ['aaa', 'aaa.bbb', 'aaa.bbb.ccc'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            item = hosts[_i];
            _results.push(expect(host.test(item, pattern)).toBe(true));
          }
          return _results;
        });
        it('should match correct hosts when *.hostname is used', function() {
          var key, pairs, pattern, val, _results;
          pairs = {
            'aaa.bbb': '*.bbb',
            'aaa.bbb.ccc': '*.ccc',
            'aaa.bbb.ccc': '*.bbb.ccc'
          };
          _results = [];
          for (key in pairs) {
            val = pairs[key];
            pattern = host.sanitize(val);
            _results.push(expect(host.test(key, pattern)).toBe(true));
          }
          return _results;
        });
        it('should not match incorrect hosts when *.hostname is used', function() {
          var key, pairs, pattern, val, _results;
          pairs = {
            'aaa.bbb': '*.xxx',
            'aaa.bbb.ccc': '*.xxx',
            'aaa.bbb.ccc': '*.bbb.xxx'
          };
          _results = [];
          for (key in pairs) {
            val = pairs[key];
            pattern = host.sanitize(val);
            _results.push(expect(host.test(key, pattern)).toBe(false));
          }
          return _results;
        });
        it('should match correct hosts when specific hostname is used', function() {
          var hosts, item, pattern, _i, _len, _results;
          hosts = ['aaa', 'aaa.bbb', 'aaa.bbb.ccc'];
          _results = [];
          for (_i = 0, _len = hosts.length; _i < _len; _i++) {
            item = hosts[_i];
            pattern = host.sanitize(item);
            _results.push(expect(host.test(item, pattern)).toBe(true));
          }
          return _results;
        });
        return it('should not match incorrect hosts when specific hostname is used', function() {
          var key, pairs, pattern, val, _results;
          pairs = {
            'aaa': 'xxx',
            'aaa.bbb': 'xxx.bbb',
            'aaa.bbb': 'aaa.xxx',
            'aaa.bbb.ccc': 'xxx.bbb.ccc',
            'aaa.bbb.ccc': 'aaa.xxx.ccc',
            'aaa.bbb.ccc': 'aaa.bbb.xxx'
          };
          _results = [];
          for (key in pairs) {
            val = pairs[key];
            pattern = host.sanitize(val);
            _results.push(expect(host.test(key, pattern)).toBe(false));
          }
          return _results;
        });
      });
    });
    describe('Path', function() {
      var path;
      path = null;
      beforeEach(function() {
        return path = new UrlMatch.Path();
      });
      describe('validate', function() {
        it('should validate asterisk', function() {
          var paths, pattern, _i, _len, _results;
          paths = ['*', '*/*', 'aaa*', '*aaa', 'aaa*bbb', '*/aaa', 'aaa/*', 'aaa/*/bbb'];
          _results = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            pattern = paths[_i];
            _results.push(expect(path.validate(pattern)).toBe(true));
          }
          return _results;
        });
        return it('should validate specific path', function() {
          var paths, pattern, _i, _len, _results;
          paths = ['aaa', 'aaa/', 'aaa/bbb', 'aaa/bbb/'];
          _results = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            pattern = paths[_i];
            _results.push(expect(path.validate(pattern)).toBe(true));
          }
          return _results;
        });
      });
      describe('sanitize', function() {});
      return describe('test', function() {
        it('should match any path when * is used', function() {
          var item, paths, pattern, _i, _len, _results;
          paths = ['', '/', 'aaa', 'aaa/', 'aaa/bbb', 'aaa/bbb/', 'aaa/bbb.ccc'];
          pattern = path.sanitize('*');
          _results = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            item = paths[_i];
            _results.push(expect(path.test(item, pattern)).toBe(true));
          }
          return _results;
        });
        it('should match correct paths when path with * is specified', function() {
          var key, pairs, pattern, val, _i, _len, _results;
          pairs = {
            'aaa': 'aaa*',
            'aaa/': 'aaa*/',
            'aaa/': 'aaa/*',
            'aaa/bbb.ccc': 'aaa/bbb.ccc*',
            'aaa/bbb.ccc': 'aaa/*.ccc',
            'aaa/bbb.ccc': '*/*.ccc'
          };
          _results = [];
          for (val = _i = 0, _len = pairs.length; _i < _len; val = ++_i) {
            key = pairs[val];
            pattern = path.sanitize(val);
            _results.push(expect(path.test(key, pattern)).tobe(true));
          }
          return _results;
        });
        it('should not match incorrect paths when path with * is specified', function() {
          var key, pairs, pattern, val, _i, _len, _results;
          pairs = {
            'bbb': 'aaa*',
            'aaa/bbb': 'aaa*/',
            'bbb/': 'aaa/*',
            'aaa/ccc': 'aaa/*.ccc',
            'bbb.ccc': '*/*.ccc'
          };
          _results = [];
          for (val = _i = 0, _len = pairs.length; _i < _len; val = ++_i) {
            key = pairs[val];
            pattern = path.sanitize(val);
            _results.push(expect(path.test(key, pattern)).tobe(false));
          }
          return _results;
        });
        it('should assume trailing slash is present when matching', function() {
          var key, pairs, pattern, val, _i, _len, _results;
          pairs = {
            '': '*',
            'aaa': 'aaa/*',
            'aaa/bbb': 'aaa/bbb/*'
          };
          _results = [];
          for (val = _i = 0, _len = pairs.length; _i < _len; val = ++_i) {
            key = pairs[val];
            pattern = path.sanitize(val);
            _results.push(expect(path.test(key, pattern)).toBe(true));
          }
          return _results;
        });
        it('should match correct paths specific when path is specified', function() {
          var item, paths, pattern, _i, _len, _results;
          paths = ['', 'aaa', 'aaa/bbb', 'aaa/bbb.ccc'];
          _results = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            item = paths[_i];
            pattern = path.sanitize(item);
            _results.push(expect(path.test(item, pattern)).toBe(true));
          }
          return _results;
        });
        return it('should treat missing path as empty string', function() {
          var pattern;
          pattern = path.sanitize(null);
          expect(path.test(null, pattern)).toBe(true);
          expect(path.test('', pattern)).toBe(true);
          return expect(path.test('aaa', pattern)).toBe(false);
        });
      });
    });
    describe('Params', function() {
      var params;
      params = null;
      beforeEach(function() {
        return params = new UrlMatch.Params();
      });
      describe('validate', function() {
        it('should validate asterisk', function() {
          return expect(params.validate('*')).toBe(true);
        });
        it('should validate full pair (key and value defined)', function() {
          return expect(params.validate('aaa=bbb')).toBe(true);
        });
        it('should validate valueless param', function() {
          var pattern, patterns, _i, _len, _results;
          patterns = ['aaa', 'aaa=bbb&ccc'];
          _results = [];
          for (_i = 0, _len = patterns.length; _i < _len; _i++) {
            pattern = patterns[_i];
            _results.push(expect(params.validate(pattern)).toBe(true));
          }
          return _results;
        });
        it('should validate on multiple pairs', function() {
          var pattern, patterns, _i, _len, _results;
          patterns = ['aaa=bbb&ccc=ddd', 'aaa=bbb&ccc=ddd&eee=fff'];
          _results = [];
          for (_i = 0, _len = patterns.length; _i < _len; _i++) {
            pattern = patterns[_i];
            _results.push(expect(params.validate(pattern)).toBe(true));
          }
          return _results;
        });
        it('should validate on pair with asterisk instead of key or value', function() {
          var pattern, patterns, _i, _len, _results;
          patterns = ['*=*', 'aaa=*', '*=aaa', 'aaa=*&*=bbb'];
          _results = [];
          for (_i = 0, _len = patterns.length; _i < _len; _i++) {
            pattern = patterns[_i];
            _results.push(expect(params.validate(pattern)).toBe(true));
          }
          return _results;
        });
        it('should not validate multiple equal signs', function() {
          var pattern, patterns, _i, _len, _results;
          patterns = ['==', 'aaa==bbb'];
          _results = [];
          for (_i = 0, _len = patterns.length; _i < _len; _i++) {
            pattern = patterns[_i];
            _results.push(expect(params.validate(pattern)).toBe(false));
          }
          return _results;
        });
        it('should not validate pairs undivided by ampersand', function() {
          var pattern, patterns, _i, _len, _results;
          patterns = ['aaa=bbb=', '=aaa=bbb', 'aaa=bbb=ccc'];
          _results = [];
          for (_i = 0, _len = patterns.length; _i < _len; _i++) {
            pattern = patterns[_i];
            _results.push(expect(params.validate(pattern)).toBe(false));
          }
          return _results;
        });
        it('should not validate an asterisk sandwitch', function() {
          return expect(params.validate('aaa=*=bbb')).toBe(false);
        });
        return it('should not validate single equal sign', function() {
          return expect(params.validate('=')).toBe(false);
        });
      });
      describe('sanitize', function() {
        it('should return empty hash on empty', function() {
          return expect(params.sanitize()).toEqual({});
        });
        it('should return empty hash on single asterisk', function() {
          return expect(params.sanitize('*')).toEqual({});
        });
        it('should break the single pair pattern down to key/val pairs', function() {
          return expect(params.sanitize('aaa=bbb')).toEqual({
            'aaa': '=bbb'
          });
        });
        it('should break the multi pair pattern down to key/val pairs', function() {
          return expect(params.sanitize('aaa=bbb&ccc=ddd')).toEqual({
            'aaa': '=bbb',
            'ccc': '=ddd'
          });
        });
        it('should replace asterisks in keys with universal matches', function() {
          return expect(params.sanitize('*=bbb')).toEqual({
            '.+': '=bbb'
          });
        });
        it('should replace asterisks in vals with universal matches', function() {
          return expect(params.sanitize('aaa=*')).toEqual({
            'aaa': '=?.*'
          });
        });
        return it('should replace partial asterisks with universal matches', function() {
          return expect(params.sanitize('aaa*=*bbb&ccc*ddd=*eee*')).toEqual({
            'aaa.*': '=.*bbb',
            'ccc.*ddd': '=.*eee.*'
          });
        });
      });
      return describe('test', function() {
        it('should match empty params on universal match', function() {
          var pattern;
          pattern = params.sanitize('*');
          return expect(params.test('', pattern)).toBe(true);
        });
        it('should match any params on universal match', function() {
          var item, items, pattern, _i, _len, _results;
          pattern = params.sanitize('*');
          items = ['aaa', 'aaa=bbb', 'aaa=bbb&ccc=ddd'];
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            _results.push(expect(params.test(item, pattern)).toBe(true));
          }
          return _results;
        });
        it('should match at least one param on asterisk to asterisk match', function() {
          var pattern;
          pattern = params.sanitize('*=*');
          expect(params.test('', pattern)).toBe(false);
          expect(params.test('aaa', pattern)).toBe(true);
          expect(params.test('aaa=bbb', pattern)).toBe(true);
          return expect(params.test('aaa=bbb&ccc=ddd', pattern)).toBe(true);
        });
        it('should match single key/val pair', function() {
          var invalid_items, item, pattern, valid_items, _i, _j, _len, _len1, _results;
          pattern = params.sanitize('aaa=bbb');
          valid_items = ['aaa=bbb'];
          for (_i = 0, _len = valid_items.length; _i < _len; _i++) {
            item = valid_items[_i];
            expect(params.test(item, pattern)).toBe(true);
          }
          invalid_items = ['aaa', 'bbb', 'bbb=aaa', 'ccc=ddd'];
          _results = [];
          for (_j = 0, _len1 = invalid_items.length; _j < _len1; _j++) {
            item = invalid_items[_j];
            _results.push(expect(params.test(item, pattern)).toBe(false));
          }
          return _results;
        });
        it('should match single key/val pair among many pairs', function() {
          var invalid_items, item, pattern, valid_items, _i, _j, _len, _len1, _results;
          pattern = params.sanitize('aaa=bbb');
          valid_items = ['aaa=bbb&ccc=ddd', 'ccc=ddd&aaa=bbb&eee=fff'];
          for (_i = 0, _len = valid_items.length; _i < _len; _i++) {
            item = valid_items[_i];
            expect(params.test(item, pattern)).toBe(true);
          }
          invalid_items = ['bbb=aaa&ccc=ddd', 'ccc=ddd&eee=fff&ggg=hhh'];
          _results = [];
          for (_j = 0, _len1 = invalid_items.length; _j < _len1; _j++) {
            item = invalid_items[_j];
            _results.push(expect(params.test(item, pattern)).toBe(false));
          }
          return _results;
        });
        it('should match multiple key/val pairs in any order', function() {
          var item, pattern, valid_items, _i, _len, _results;
          pattern = params.sanitize('aaa=bbb&ccc=ddd');
          valid_items = ['ccc=ddd&aaa=bbb', 'eee=fff&aaa=bbb&ccc=ddd'];
          _results = [];
          for (_i = 0, _len = valid_items.length; _i < _len; _i++) {
            item = valid_items[_i];
            _results.push(expect(params.test(item, pattern)).toBe(true));
          }
          return _results;
        });
        it('should match pair with universal key', function() {
          var pattern;
          pattern = params.sanitize('aaa=*');
          return expect(params.test('aaa=bbb', pattern)).toBe(true);
        });
        return it('should match pair with universal val', function() {
          var pattern;
          pattern = params.sanitize('*=bbb');
          return expect(params.test('aaa=bbb', pattern)).toBe(true);
        });
      });
    });
    return describe('Fragment', function() {
      var fragment;
      fragment = null;
      beforeEach(function() {
        return fragment = new UrlMatch.Fragment();
      });
      describe('validate', function() {
        it('should validate asterisk', function() {
          return expect(fragment.validate('*')).toBe(true);
        });
        it('should not validate invalid characters', function() {
          return expect(fragment.validate('#')).toBe(false);
        });
        return it('should validate on combination of characters and asterixes', function() {
          return expect(fragment.validate('aaa*bbb*ccc')).toBe(true);
        });
      });
      describe('sanitize', function() {
        it('should sanitize single asterisk', function() {
          return expect(fragment.sanitize('*')).toEqual(/^.*$/);
        });
        it('should sanitize characters with single asterisk', function() {
          expect(fragment.sanitize('aaa*')).toEqual(/^aaa.*$/);
          expect(fragment.sanitize('*bbb')).toEqual(/^.*bbb$/);
          return expect(fragment.sanitize('aaa*bbb')).toEqual(/^aaa.*bbb$/);
        });
        return it('should sanitize characters with multiple asterisk', function() {
          return expect(fragment.sanitize('aaa*bbb*ccc')).toEqual(/^aaa.*bbb.*ccc$/);
        });
      });
      return describe('test', function() {
        it('should match empty fragment on universal match', function() {
          var pattern;
          pattern = fragment.sanitize('*');
          expect(fragment.test(null, pattern)).toBe(true);
          return expect(fragment.test('', pattern)).toBe(true);
        });
        it('should match any fragment on universal match', function() {
          var pattern;
          pattern = fragment.sanitize('*');
          return expect(fragment.test('aaa', pattern)).toBe(true);
        });
        it('should match specific fragment', function() {
          var pattern;
          pattern = fragment.sanitize('aaa');
          return expect(fragment.test('aaa', pattern)).toBe(true);
        });
        it('should match fragment with single asterix', function() {
          var pattern;
          pattern = fragment.sanitize('aaa*');
          expect(fragment.test('aaa', pattern)).toBe(true);
          return expect(fragment.test('aaabbb', pattern)).toBe(true);
        });
        it('should not match invalid fragment with single asterix', function() {
          var pattern;
          pattern = fragment.sanitize('aaa*');
          expect(fragment.test('bbb', pattern)).toBe(false);
          return expect(fragment.test('bbbaaa', pattern)).toBe(false);
        });
        it('should match fragment with multiple asterixes', function() {
          var pattern;
          pattern = fragment.sanitize('aaa*bbb*');
          expect(fragment.test('aaabbb', pattern)).toBe(true);
          return expect(fragment.test('aaaxxxbbbxxx', pattern)).toBe(true);
        });
        return it('should not match invalid fragment with multiple asterixes', function() {
          var pattern;
          pattern = fragment.sanitize('aaa*bbb*');
          expect(fragment.test('xxx', pattern)).toBe(false);
          expect(fragment.test('xxxaaa', pattern)).toBe(false);
          return expect(fragment.test('xxxaaabbb', pattern)).toBe(false);
        });
      });
    });
  });

  describe('Real life examples', function() {
    it('should do universal match', function() {
      var my_match;
      my_match = new UrlMatch('*');
      expect(my_match.test('http://www.google.com/')).toBe(true);
      expect(my_match.test('https://www.google.com/preferences?hl=en')).toBe(true);
      return expect(my_match.test('this.is.not/valid.url')).toBe(false);
    });
    it('should do simple match', function() {
      var my_match;
      my_match = new UrlMatch('*://*.google.com/*');
      expect(my_match.test('http://www.google.com/')).toBe(true);
      expect(my_match.test('http://calendar.google.com/')).toBe(true);
      expect(my_match.test('https://www.google.com/preferences?hl=en')).toBe(true);
      expect(my_match.test('http://www.facebook.com/')).toBe(false);
      return expect(my_match.test('http://www.google.sucks.com/')).toBe(false);
    });
    it('should work on URLs with port', function() {
      var my_match;
      my_match = new UrlMatch('*://*.google.com/*');
      return expect(my_match.test('http://www.google.com:8080/')).toBe(true);
    });
    it('should do match on multiple patterns', function() {
      var my_match;
      my_match = new UrlMatch(['*://*.google.com/*', '*://*.facebook.com/*']);
      expect(my_match.test('http://www.google.com/')).toBe(true);
      expect(my_match.test('http://www.facebook.com/')).toBe(true);
      return expect(my_match.test('http://www.apple.com/')).toBe(false);
    });
    it('should handle adding and removing of patterns', function() {
      var my_match;
      my_match = new UrlMatch('*://*.google.com/*');
      expect(my_match.test('http://www.google.com/')).toBe(true);
      expect(my_match.test('http://www.facebook.com/')).toBe(false);
      my_match.add('*://*.facebook.com/*');
      expect(my_match.test('http://www.google.com/')).toBe(true);
      expect(my_match.test('http://www.facebook.com/')).toBe(true);
      my_match.remove('*://*.google.com/*');
      expect(my_match.test('http://www.google.com/')).toBe(false);
      return expect(my_match.test('http://www.facebook.com/')).toBe(true);
    });
    it('should handle localhost', function() {
      var my_match;
      my_match = new UrlMatch('*://*/aaa');
      return expect(my_match.test('http://localhost/aaa')).toBe(true);
    });
    return it('should handle localhost with port', function() {
      var my_match;
      my_match = new UrlMatch('*://*/aaa');
      return expect(my_match.test('http://localhost:3000/aaa')).toBe(true);
    });
  });

}).call(this);
