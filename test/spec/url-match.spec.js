(function() {
  describe('URL Match', function() {
    it('should exist', function() {
      return expect(UrlMatch).toBeDefined();
    });
    it('should accept single pattern', function() {
      var a, b;
      a = new UrlMatch();
      a.addPattern('*');
      expect(a._patterns.length).toBe(1);
      b = new UrlMatch('*');
      return expect(b._patterns.length).toBe(1);
    });
    it('should accept array of patterns', function() {
      var a, b;
      a = new UrlMatch();
      a.addPattern(['*', '*', '*']);
      expect(a._patterns.length).toBe(3);
      b = new UrlMatch(['*', '*', '*']);
      return expect(b._patterns.length).toBe(3);
    });
    it('should remove pattern', function() {
      var a;
      a = new UrlMatch(['*', '*', '*']);
      a.removePattern('*');
      return expect(a._patterns.length).toBe(0);
    });
    it('should not add pattern if scheme operator is incorrect', function() {
      var a;
      a = new UrlMatch(['http:aaa.bbb/ccc', 'http:/aaa.bbb/ccc', 'http/aaa.bbb/ccc', 'http//aaa.bbb/ccc']);
      return expect(a._patterns.length).toBe(0);
    });
    it('should match URL against a general pattern', function() {
      var a;
      a = new UrlMatch('*');
      expect(a.test('http://aaa.bbb/ccc')).toBe(true);
      return expect(a.test('https://aaa.bbb/ccc')).toBe(true);
    });
    it('should match correct scheme', function() {
      var a;
      a = new UrlMatch('http://*/*');
      expect(a.test('http://aaa.bbb/')).toBe(true);
      return expect(a.test('https://aaa.bbb/')).toBe(false);
    });
    it('should match correct host', function() {
      var a, b;
      a = new UrlMatch('*://aaa.bbb/*');
      b = new UrlMatch('*://*.bbb/*');
      expect(a.test('http://aaa.bbb/')).toBe(true);
      expect(a.test('http://xxx.yyy/')).toBe(false);
      expect(b.test('http://aaa.bbb/')).toBe(true);
      return expect(b.test('http://xxx.yyy/')).toBe(false);
    });
    it('should match correct path', function() {
      var a;
      a = new UrlMatch('*://*/ccc/*');
      expect(a.test('http://aaa.bbb/ccc')).toBe(true);
      expect(a.test('http://aaa.bbb/ccc/')).toBe(true);
      expect(a.test('http://aaa.bbb/ccc/ddd')).toBe(true);
      expect(a.test('http://aaa.bbb/ddd')).toBe(false);
      expect(a.test('http://aaa.bbb/ddd/')).toBe(false);
      return expect(a.test('http://aaa.bbb/ddd/ccc')).toBe(false);
    });
    return it('should match URL against multiple patterns', function() {
      var a;
      a = new UrlMatch(['*://aaa.bbb/*', '*://ccc.ddd/*']);
      expect(a.test('http://aaa.bbb/ccc')).toBe(true);
      expect(a.test('http://ccc.ddd/')).toBe(true);
      expect(a.test('http://ccc.ddd/eee.fff')).toBe(true);
      return expect(a.test('http://xxx.yyy/')).toBe(false);
    });
  });

  describe('Pattern', function() {
    var pattern;
    pattern = null;
    beforeEach(function() {
      return pattern = (new UrlMatch('*'))._patterns[0];
    });
    it('should validate', function() {
      var data;
      expect(pattern.validate()).toBe(true);
      data = pattern.getParts({
        scheme: '*',
        host: '*',
        path: '/*'
      });
      return expect(pattern.validate(data)).toBe(true);
    });
    it('should not validate if scheme is missing', function() {
      var data;
      data = pattern.getParts({
        scheme: '',
        host: '*',
        path: '/*'
      });
      return expect(pattern.validate(data)).toBe(false);
    });
    it('should not validate if host is missing', function() {
      var data;
      data = pattern.getParts({
        scheme: '*',
        host: '',
        path: '/*'
      });
      return expect(pattern.validate(data)).toBe(false);
    });
    it('should not validate if path is missing', function() {
      var data;
      data = pattern.getParts({
        scheme: '*',
        host: '*',
        path: ''
      });
      return expect(pattern.validate(data)).toBe(false);
    });
    it('should convert <all_urls> into *://*/*', function() {
      return expect(pattern.sanitize('<all_urls>')).toBe('*://*/*');
    });
    it('should convert * into *://*/*', function() {
      return expect(pattern.sanitize('*')).toBe('*://*/*');
    });
    it('should sanitize', function() {
      expect(pattern.sanitize('*://*/*')).toBe('*://*/*');
      expect(pattern.sanitize('aaa://*/*')).toBe('aaa://*/*');
      expect(pattern.sanitize('aaa://bbb/*')).toBe('aaa://bbb/*');
      expect(pattern.sanitize('*://bbb/*')).toBe('*://bbb/*');
      expect(pattern.sanitize('aaa://bbb/ccc')).toBe('aaa://bbb/ccc');
      expect(pattern.sanitize('*://bbb/ccc')).toBe('*://bbb/ccc');
      expect(pattern.sanitize('aaa://*/ccc')).toBe('aaa://*/ccc');
      return expect(pattern.sanitize('*://*/ccc')).toBe('*://*/ccc');
    });
    it('should split valid pattern into parts', function() {
      var result;
      result = pattern.split('*://*/*');
      expect(result.scheme).toBe('*');
      expect(result.host).toBe('*');
      expect(result.path).toBe('/*');
      result = pattern.split('aaa://bbb.ccc/ddd');
      expect(result.scheme).toBe('aaa');
      expect(result.host).toBe('bbb.ccc');
      return expect(result.path).toBe('/ddd');
    });
    it('should split invalid valid pattern into empty parts', function() {
      var result;
      result = pattern.split('');
      expect(result.scheme).toBe('');
      expect(result.host).toBe('');
      expect(result.path).toBe('');
      result = pattern.split('xxx');
      expect(result.scheme).toBe('');
      expect(result.host).toBe('');
      return expect(result.path).toBe('');
    });
    it('should match any URL when *://*/* is used', function() {
      pattern = (new UrlMatch('*'))._patterns[0];
      expect(pattern.test('http://aaa.bbb/')).toBe(true);
      expect(pattern.test('http://aaa.bbb/ccc')).toBe(true);
      expect(pattern.test('http://aaa.bbb/ccc.ddd')).toBe(true);
      expect(pattern.test('http://aaa.bbb/ccc/ddd')).toBe(true);
      return expect(pattern.test('http://aaa.bbb/ccc/ddd.eee')).toBe(true);
    });
    it('should match correctly when specific URL is used', function() {
      pattern = (new UrlMatch('http://aaa.bbb/*'))._patterns[0];
      expect(pattern.test('http://aaa.bbb/')).toBe(true);
      expect(pattern.test('https://aaa.bbb/')).toBe(false);
      expect(pattern.test('http://xxx.yyy/')).toBe(false);
      expect(pattern.test('http://aaa.bbb/ccc')).toBe(true);
      expect(pattern.test('http://aaa.bbb/ccc.ddd')).toBe(true);
      expect(pattern.test('http://aaa.bbb/ccc/ddd')).toBe(true);
      return expect(pattern.test('http://aaa.bbb/ccc/ddd.eee')).toBe(true);
    });
    it('should not match non-matching URLs', function() {
      pattern = (new UrlMatch('*://xxx.yyy/*'))._patterns[0];
      expect(pattern.test('http://aaa.bbb/')).toBe(false);
      expect(pattern.test('http://aaa.bbb/ccc')).toBe(false);
      expect(pattern.test('http://aaa.bbb/ccc.ddd')).toBe(false);
      expect(pattern.test('http://aaa.bbb/ccc/ddd')).toBe(false);
      return expect(pattern.test('http://aaa.bbb/ccc/ddd.eee')).toBe(false);
    });
    return it('should not match invalid URLs', function() {
      pattern = (new UrlMatch('*'))._patterns[0];
      expect(pattern.test('http://')).toBe(false);
      expect(pattern.test('http:aaa.bbb/')).toBe(false);
      return expect(pattern.test('aaa.bbb')).toBe(false);
    });
  });

  describe('Scheme', function() {
    var scheme;
    scheme = null;
    beforeEach(function() {
      return scheme = (new UrlMatch('*'))._patterns[0].parts.scheme;
    });
    it('should create correct pattern', function() {
      scheme = (new UrlMatch('*'))._patterns[0].parts.scheme;
      expect(scheme.pattern).toBe('https?');
      scheme = (new UrlMatch('http://*/*'))._patterns[0].parts.scheme;
      return expect(scheme.pattern).toBe('http');
    });
    it('should validate asterisk', function() {
      return expect(scheme.validate('*')).toBe(true);
    });
    it('should not validate more than one asterisk', function() {
      expect(scheme.validate('*')).toBe(true);
      expect(scheme.validate('**')).toBe(false);
      expect(scheme.validate('*aaa*')).toBe(false);
      expect(scheme.validate('aaa**bbb')).toBe(false);
      expect(scheme.validate('aaa*bbb*')).toBe(false);
      return expect(scheme.validate('aaa*bbb*ccc')).toBe(false);
    });
    it('should not validate string of characters', function() {
      expect(scheme.validate('aaa')).toBe(true);
      expect(scheme.validate('http')).toBe(true);
      return expect(scheme.validate('https')).toBe(true);
    });
    it('should not validate numbers', function() {
      expect(scheme.validate('123')).toBe(false);
      expect(scheme.validate('aaa123')).toBe(false);
      expect(scheme.validate('123bbb')).toBe(false);
      return expect(scheme.validate('aaa123bbb')).toBe(false);
    });
    it('should not validate special characters', function() {
      expect(scheme.validate('aaa-')).toBe(false);
      expect(scheme.validate('-bbb')).toBe(false);
      expect(scheme.validate('aaa-bbb')).toBe(false);
      expect(scheme.validate('?')).toBe(false);
      return expect(scheme.validate('!')).toBe(false);
    });
    it('should sanitize', function() {
      expect(scheme.sanitize('*')).toBe('https?');
      expect(scheme.sanitize('http')).toBe('http');
      expect(scheme.sanitize('https')).toBe('https');
      return expect(scheme.sanitize('aaa')).toBe('aaa');
    });
    it('should match only http and https schemes when * is used', function() {
      expect(scheme.test('http', scheme.sanitize('*'))).toBe(true);
      expect(scheme.test('https', scheme.sanitize('*'))).toBe(true);
      return expect(scheme.test('aaa', scheme.sanitize('*'))).toBe(false);
    });
    it('should match only http/https scheme when specific scheme provided', function() {
      expect(scheme.test('http', 'http')).toBe(true);
      expect(scheme.test('http', 'https')).toBe(false);
      expect(scheme.test('https', 'https')).toBe(true);
      return expect(scheme.test('http', 'https')).toBe(false);
    });
    return it('should match only specific scheme when provided', function() {
      expect(scheme.test('aaa', 'aaa')).toBe(true);
      expect(scheme.test('aaa', 'aaaaaa')).toBe(false);
      return expect(scheme.test('aaa', 'bbb')).toBe(false);
    });
  });

  describe('Host', function() {
    var host;
    host = null;
    beforeEach(function() {
      return host = (new UrlMatch('*'))._patterns[0].parts.host;
    });
    it('should not validate if empty', function() {
      return expect(host.validate('')).toBe(false);
    });
    it('should validate asterisk', function() {
      return expect(host.validate('*')).toBe(true);
    });
    it('should not validate multiple asterisks', function() {
      expect(host.validate('**')).toBe(false);
      expect(host.validate('**.aaa')).toBe(false);
      return expect(host.validate('**.aaa.bbb')).toBe(false);
    });
    it('should validate domains', function() {
      return expect(host.validate('aaa.bbb')).toBe(true);
    });
    it('should validate subdomains', function() {
      expect(host.validate('aaa.bbb.ccc')).toBe(true);
      return expect(host.validate('aaa.bbb.ccc.ddd')).toBe(true);
    });
    it('should validate asterisk at the beginning of domain', function() {
      expect(host.validate('*.aaa')).toBe(true);
      return expect(host.validate('*.aaa.bbb')).toBe(true);
    });
    it('should not validate if asterisk is not followed by a dot', function() {
      expect(host.validate('*aaa')).toBe(false);
      return expect(host.validate('*aaa.bbb')).toBe(false);
    });
    it('should not validate if asterisk is not at the beginning', function() {
      expect(host.validate('aaa*')).toBe(false);
      return expect(host.validate('aaa*bbb')).toBe(false);
    });
    it('should not validate characters except letters, numbers and hyphen', function() {
      expect(host.validate('aaa?bbb.ccc')).toBe(false);
      expect(host.validate('aaa_bbb.ccc')).toBe(false);
      return expect(host.validate('aaa+bbb.ccc')).toBe(false);
    });
    it('should not validate when starts or ends with dot or hyphen', function() {
      expect(host.validate('-aaa.bbb')).toBe(false);
      expect(host.validate('.aaa.bbb')).toBe(false);
      expect(host.validate('aaa.bbb-')).toBe(false);
      return expect(host.validate('aaa.bbb.')).toBe(false);
    });
    it('should sanitize', function() {
      expect(host.sanitize('*')).toBe('[a-z0-9-.]+');
      expect(host.sanitize('*.aaa')).toBe('[a-z0-9-.]+\.aaa');
      return expect(host.sanitize('aaa.bbb')).toBe('aaa\.bbb');
    });
    it('should match any host when * is used', function() {
      expect(host.test('aaa', host.sanitize('*'))).toBe(true);
      expect(host.test('aaa.bbb', host.sanitize('*'))).toBe(true);
      return expect(host.test('aaa.bbb.ccc', host.sanitize('*'))).toBe(true);
    });
    it('should match correct hosts when *.hostname is used', function() {
      expect(host.test('aaa.bbb', host.sanitize('*.bbb'))).toBe(true);
      expect(host.test('aaa.bbb.ccc', host.sanitize('*.ccc'))).toBe(true);
      expect(host.test('aaa.bbb.ccc', host.sanitize('*.bbb.ccc'))).toBe(true);
      expect(host.test('aaa.bbb', host.sanitize('*.xxx'))).toBe(false);
      expect(host.test('aaa.bbb.ccc', host.sanitize('*.xxx'))).toBe(false);
      return expect(host.test('aaa.bbb.ccc', host.sanitize('*.bbb.xxx'))).toBe(false);
    });
    return it('should match correct hosts when specific hostname is used', function() {
      expect(host.test('aaa', host.sanitize('aaa'))).toBe(true);
      expect(host.test('aaa.bbb', host.sanitize('aaa.bbb'))).toBe(true);
      expect(host.test('aaa.bbb.ccc', host.sanitize('aaa.bbb.ccc'))).toBe(true);
      expect(host.test('aaa', host.sanitize('xxx'))).toBe(false);
      expect(host.test('aaa.bbb', host.sanitize('xxx.bbb'))).toBe(false);
      expect(host.test('aaa.bbb', host.sanitize('aaa.xxx'))).toBe(false);
      expect(host.test('aaa.bbb.ccc', host.sanitize('xxx.bbb.ccc'))).toBe(false);
      expect(host.test('aaa.bbb.ccc', host.sanitize('aaa.xxx.ccc'))).toBe(false);
      return expect(host.test('aaa.bbb.ccc', host.sanitize('aaa.bbb.xxx'))).toBe(false);
    });
  });

  describe('Path', function() {
    var path;
    path = null;
    beforeEach(function() {
      return path = (new UrlMatch('*'))._patterns[0].parts.path;
    });
    it('should validate only if starts with a slash', function() {
      expect(path.validate('/')).toBe(true);
      expect(path.validate('/*')).toBe(true);
      return expect(path.validate('/aaa')).toBe(true);
    });
    it('should not validate if does not start with slash', function() {
      expect(path.validate('')).toBe(false);
      expect(path.validate('*')).toBe(false);
      return expect(path.validate('aaa')).toBe(false);
    });
    it('should validate asterisk', function() {
      expect(path.validate('/*')).toBe(true);
      expect(path.validate('/aaa*')).toBe(true);
      expect(path.validate('/*aaa')).toBe(true);
      return expect(path.validate('/aaa*bbb')).toBe(true);
    });
    it('should sanitize', function() {
      expect(path.sanitize('/')).toBe('/');
      expect(path.sanitize('/*')).toBe('/[a-z0-9-./]*');
      expect(path.sanitize('/*aaa')).toBe('/[a-z0-9-./]*aaa');
      return expect(path.sanitize('/aaa/bbb.ccc')).toBe('/aaa/bbb.ccc');
    });
    it('should match any path when /* is used', function() {
      expect(path.test('/', path.sanitize('/*'))).toBe(true);
      expect(path.test('/aaa', path.sanitize('/*'))).toBe(true);
      expect(path.test('/aaa/bbb', path.sanitize('/*'))).toBe(true);
      return expect(path.test('/aaa/bbb.ccc', path.sanitize('/*'))).toBe(true);
    });
    it('should match correct paths when path with * is specified', function() {
      expect(path.test('/', path.sanitize('/*'))).toBe(true);
      expect(path.test('/aaa', path.sanitize('/*'))).toBe(true);
      expect(path.test('/aaa/bbb', path.sanitize('/*'))).toBe(true);
      expect(path.test('/aaa/bbb.ccc', path.sanitize('/*'))).toBe(true);
      expect(path.test('/', path.sanitize('/aaa*'))).toBe(false);
      expect(path.test('/aaa', path.sanitize('/aaa*'))).toBe(true);
      expect(path.test('/aaa/', path.sanitize('/aaa*'))).toBe(true);
      expect(path.test('/aaa/', path.sanitize('/aaa/*'))).toBe(true);
      expect(path.test('/aaa/bbb.ccc', path.sanitize('/aaa/bbb.ccc*'))).toBe(true);
      expect(path.test('/aaa/bbb.ccc', path.sanitize('/aaa/*.ccc'))).toBe(true);
      return expect(path.test('/aaa/bbb.ccc', path.sanitize('/*/*.ccc'))).toBe(true);
    });
    it('should assume trailing slash is present when validating', function() {
      expect(path.test('', path.sanitize('/*'))).toBe(false);
      expect(path.test('/aaa', path.sanitize('/aaa/*'))).toBe(true);
      return expect(path.test('/aaa/bbb', path.sanitize('/aaa/bbb/*'))).toBe(true);
    });
    return it('should match correct paths specific when path is specified', function() {
      expect(path.test('/', path.sanitize('/'))).toBe(true);
      expect(path.test('/aaa', path.sanitize('/aaa'))).toBe(true);
      expect(path.test('/aaa/bbb', path.sanitize('/aaa/bbb'))).toBe(true);
      return expect(path.test('/aaa/bbb.ccc', path.sanitize('/aaa/bbb.ccc'))).toBe(true);
    });
  });

}).call(this);
