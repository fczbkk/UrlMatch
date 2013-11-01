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
    return it('should match URL against multiple patterns', function() {});
  });

  describe('Pattern', function() {
    it('should validate', function() {});
    it('should not validate if scheme, host or path is missing', function() {});
    it('should not validate if scheme operator is incorrect', function() {});
    it('should sanitize', function() {});
    it('should split pattern into scheme, host and path parts', function() {});
    it('should convert <all_urls> into *://*/*', function() {});
    it('should convert * into *://*/*', function() {});
    it('should match any URL when *://*/* is used', function() {});
    return it('should match correctly when specific URL is used', function() {});
  });

  describe('Scheme', function() {
    var scheme;
    scheme = null;
    beforeEach(function() {
      return scheme = (new UrlMatch('*'))._patterns[0].scheme;
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
    return it('should match only specific scheme when provided', function() {
      expect(scheme.test('aaa', 'aaa')).toBe(true);
      return expect(scheme.test('aaa', 'bbb')).toBe(false);
    });
  });

  describe('Host', function() {
    var host;
    host = null;
    beforeEach(function() {
      return host = (new UrlMatch('*'))._patterns[0].host;
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
      return path = (new UrlMatch('*'))._patterns[0].path;
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
