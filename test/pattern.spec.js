import Fragment from './../src/fragment';
import Host from './../src/host';
import Params from './../src/params';
import Path from './../src/path';
import Pattern from './../src/pattern';
import Scheme from './../src/scheme'
import complex_url from './complex-url';


describe('Pattern', function() {
  let pattern;

  beforeEach(function() {
    pattern = new Pattern();
  });

  describe('split', function() {

    it('should use null for missing parts', function() {
      const result = pattern.split('*://*/*');
      expect(result.params).toEqual(null);
      expect(result.fragment).toEqual(null);
    });

    it('should use custom value for missing parts', function() {
      const result = pattern.split('*://*/*', '*');
      expect(result.params).toEqual('*');
      expect(result.fragment).toEqual('*');
    });

    it('should split into correct parts', function() {
      const result = pattern.split('*://*/*?*#*');
      expect(result.scheme).toEqual('*');
      expect(result.host).toEqual('*');
      expect(result.path).toEqual('*');
      expect(result.params).toEqual('*');
      expect(result.fragment).toEqual('*');
    });

    it('should split pattern into correct parts', function() {
      const result = pattern.split(complex_url);
      expect(result.scheme).toEqual('http');
      expect(result.host).toEqual('aaa.bbb.ccc');
      expect(result.path).toEqual('ddd/eee');
      expect(result.params).toEqual('fff=ggg&hhh=iii');
      expect(result.fragment).toEqual('jjj');
    });

    it('should allow @ in URL', function () {
      const result = pattern.split('http://aaa.bbb/ccc@ddd');
      expect(result.host).toEqual('aaa.bbb');
      expect(result.path).toEqual('ccc@ddd');
    });

    it('should allow username and password and @ in URL', function () {
      const result = pattern.split('http://aaa:bbb@ccc.ddd/eee@fff');
      expect(result.host).toEqual('ccc.ddd');
      expect(result.path).toEqual('eee@fff');
    });

    it('should allow just username and @ in URL', function () {
      const result = pattern.split('http://aaa@bbb.ccc/ddd@eee');
      expect(result.host).toEqual('bbb.ccc');
      expect(result.path).toEqual('ddd@eee');
    });

    it('should allow @ in params', function () {
      const result = pattern.split('http://aaa.bbb?ccc=@ddd');
      expect(result.host).toEqual('aaa.bbb');
      expect(result.params).toEqual('ccc=@ddd');
    });

    it('should allow @ in fragment', function () {
      const result = pattern.split('http://aaa.bbb#@ccc');
      expect(result.host).toEqual('aaa.bbb');
      expect(result.fragment).toEqual('@ccc');
    });

    it('should not hang on long non-URL strings', function () {
      const start = performance.now();
      const result = pattern.split('a'.repeat(100) + '!');
      expect(performance.now() - start).toBeLessThan(100);
      expect(result.scheme).toEqual(null);
    });

    it('should not split URL with unparsable content after host', function () {
      const result = pattern.split('http://aaa.bbb:xyz/ccc');
      expect(result.host).toEqual(null);
      expect(result.path).toEqual(null);
    });

    it('should split port from host', function () {
      const result = pattern.split('http://aaa.bbb:8080/ccc');
      expect(result.host).toEqual('aaa.bbb');
      expect(result.port).toEqual('8080');
      expect(result.path).toEqual('ccc');
    });

  });

  describe('getUrlParts', function() {

    let url_parts;

    beforeEach(function () {
      url_parts = pattern.getUrlParts('*://*/*?*#*');
    });

    it('should get scheme', function () {
      const obj_re = new Scheme('*').pattern.toString();
      const ref_re = url_parts['scheme'].pattern.toString();
      expect(obj_re).toEqual(ref_re);
    });

    it('should get host', function () {
      const obj_re = new Host('*').pattern.toString();
      const ref_re = url_parts['host'].pattern.toString();
      expect(obj_re).toEqual(ref_re);
    });

    it('should get path', function () {
      const obj_re = new Path('*').pattern.toString();
      const ref_re = url_parts['path'].pattern.toString();
      expect(obj_re).toEqual(ref_re);
    });

    it('should get params', function () {
      const obj_re = new Params('*').pattern.toString();
      const ref_re = url_parts['params'].pattern.toString();
      expect(obj_re).toEqual(ref_re);
    });

    it('should get fragment', function () {
      const obj_re = new Fragment('*').pattern.toString();
      const ref_re = url_parts['fragment'].pattern.toString();
      expect(obj_re).toEqual(ref_re);
    });

  });

  describe('validate', function() {

    let validatePattern;

    beforeAll(function () {

      validatePattern = function(content = '', expected_value = true) {
        const url_parts = pattern.getUrlParts(content);
        expect(pattern.validate(url_parts)).toBe(expected_value);
      };

    });

    describe('valid patterns', function() {

      it('should validate universal pattern', function() {
        validatePattern('*://*/*?*#*', true);
      });

      it('should validate pattern with empty path', function() {
        validatePattern('*://*/', true);
      });

      it('should validate pattern with just scheme, host and path', function() {
        validatePattern('*://*/*', true);
        validatePattern('http://aaa.bbb/ccc', true);
      });

      it('should validate pattern with params', function() {
        validatePattern('*://*/*?aaa=bbb', true);
      });

      it('should validate pattern with fragment', function() {
        validatePattern('*://*/*#aaa', true);
      });

      it('should validate full pattern', function() {
        validatePattern('*://*/*?*#*', true);
        validatePattern(complex_url, true);
      });

    });

    describe('incomplete patterns', function() {

      it('should not validate pattern without scheme', function() {
        validatePattern('*/*', false);
        validatePattern('://*/*', false);
        validatePattern('://aaa.bbb/', false);
        validatePattern('aaa.bbb/', false);
      });

      it('should not validate pattern without host', function() {
        validatePattern('*:///*', false);
        validatePattern('http:///aaa', false);
      });
    });

    describe('invalid patterns', function() {

      it('should not validate pattern with invalid scheme', function() {
        validatePattern('http//*/*', false);
        validatePattern('http:/*/*', false);
        validatePattern('http:*/*', false);
        validatePattern('http*/*', false);
      });

      it('should not validate pattern with invalid host', function() {
        validatePattern('http://**/*', false);
        validatePattern('http://aaa*bbb/*', false);
        validatePattern('http://aaa.*/*', false);
      });

      it('should not validate pattern with invalid params', function() {
        validatePattern('*://*/*?aaa==bbb', false);
        validatePattern('*://*/*?aaa=bbb=ccc', false);
        validatePattern('*://*/*?=', false);
      });

      it('should not validate pattern with invalid fragment', function() {
        validatePattern('*://*/*##', false);
        validatePattern('*://*/*##aaa', false);
        validatePattern('*://*/*#aaa#', false);
        validatePattern('*://*/*#aaa#bbb', false);
      });

    });

  });

  describe('sanitize', function() {

    it('should convert single asterisk to universal match pattern', function() {
      pattern = new Pattern('*');
      expect(pattern.original_pattern).toEqual('*://*/*?*#*');
    });

    it('should convert `<all_urls>` to universal match pattern', function() {
      pattern = new Pattern('<all_urls>');
      expect(pattern.original_pattern).toEqual('*://*/*?*#*');
    });

  });

  describe('match', function() {

    it('should match any URL', function() {
      pattern = new Pattern('*://*/*?*#*');
      expect(pattern.test(complex_url)).toBe(true);
    });

    it('should match correct scheme', function() {
      pattern = new Pattern('http://*/*?*#*');
      expect(pattern.test(complex_url)).toBe(true);
    });

    it('should match correct host', function() {
      pattern = new Pattern('*://aaa.bbb.ccc/*?*#*');
      expect(pattern.test(complex_url)).toBe(true);
    });

    it('should match correct path', function() {
      pattern = new Pattern('*://*/ddd/eee?*#*');
      expect(pattern.test(complex_url)).toBe(true);
    });

    it('should match correct params', function() {
      pattern = new Pattern('*://*/*?fff=ggg&hhh=iii#*');
      expect(pattern.test(complex_url)).toBe(true);
    });

    it('should match correct fragment', function() {
      pattern = new Pattern('*://*/*?*#jjj');
      expect(pattern.test(complex_url)).toBe(true);
    });

    it('should match exact URL', function() {
      pattern = new Pattern(complex_url);
      expect(pattern.test(complex_url)).toBe(true);
    });

    it('should match pattern without path correctly', function() {
      pattern = new Pattern('*://aaa.bbb/');
      expect(pattern.test('http://aaa.bbb/')).toBe(true);
      expect(pattern.test('http://aaa.bbb/ccc')).toBe(false);
    });

    it('should not match URL with unparsable content after host', function() {
      pattern = new Pattern('*://aaa.bbb/');
      expect(pattern.test('http://aaa.bbb:xyz/ccc')).toBe(false);
    });

    it('should not match anything when pattern is missing scheme', function() {
      pattern = new Pattern('aaa.bbb/*');
      expect(pattern.is_valid).toBe(false);
      expect(pattern.test('http://aaa.bbb/')).toBe(false);
      expect(pattern.test('http://ccc.ddd/')).toBe(false);
    });

    it('should not match anything when pattern host is invalid', function() {
      pattern = new Pattern('*://aaa*bbb/*');
      expect(pattern.is_valid).toBe(false);
      expect(pattern.test('http://aaaxbbb/')).toBe(false);
      expect(pattern.test('http://ccc.ddd/')).toBe(false);
    });

    it('should not match anything when pattern params are invalid', function() {
      pattern = new Pattern('*://*/*?aaa==bbb');
      expect(pattern.is_valid).toBe(false);
      expect(pattern.test('http://ccc.ddd/?aaa=bbb')).toBe(false);
    });

    it('should match scheme and host case-insensitively', function() {
      pattern = new Pattern('http://aaa.bbb/');
      expect(pattern.test('HTTP://AAA.BBB/')).toBe(true);
      expect(pattern.test('http://AaA.bBb')).toBe(true);
    });

    it('should keep path matching case-sensitive', function() {
      pattern = new Pattern('*://aaa.bbb/ccc');
      expect(pattern.test('http://aaa.bbb/CCC')).toBe(false);
    });

    it('should match specific port', function() {
      pattern = new Pattern('*://aaa.bbb:8080/*');
      expect(pattern.test('http://aaa.bbb:8080/')).toBe(true);
      expect(pattern.test('http://aaa.bbb:9090/')).toBe(false);
      expect(pattern.test('http://aaa.bbb/')).toBe(false);
    });

    it('should match any port when pattern has no port', function() {
      pattern = new Pattern('*://aaa.bbb/*');
      expect(pattern.test('http://aaa.bbb/')).toBe(true);
      expect(pattern.test('http://aaa.bbb:8080/')).toBe(true);
    });

    it('should match any port on wildcard port', function() {
      pattern = new Pattern('*://aaa.bbb:*/*');
      expect(pattern.test('http://aaa.bbb:3000/')).toBe(true);
      expect(pattern.test('http://aaa.bbb/')).toBe(true);
    });

    it('should match port range on partial wildcard', function() {
      pattern = new Pattern('*://aaa.bbb:3*/*');
      expect(pattern.test('http://aaa.bbb:3000/')).toBe(true);
      expect(pattern.test('http://aaa.bbb:3001/')).toBe(true);
      expect(pattern.test('http://aaa.bbb:8080/')).toBe(false);
    });

    it('should match default port for scheme', function() {
      pattern = new Pattern('http://aaa.bbb:80/*');
      expect(pattern.test('http://aaa.bbb/')).toBe(true);
      expect(pattern.test('https://aaa.bbb/')).toBe(false);

      pattern = new Pattern('https://aaa.bbb:443/*');
      expect(pattern.test('https://aaa.bbb/')).toBe(true);
    });

    it('should not match anything when pattern port is invalid', function() {
      pattern = new Pattern('*://aaa.bbb:abc/*');
      expect(pattern.is_valid).toBe(false);
      expect(pattern.test('http://aaa.bbb/')).toBe(false);
    });

  });

  describe('debug', function () {

    it('should return debug object', function () {
      pattern = new Pattern('*://aaa.bbb/');
      const result = pattern.debug('http://aaa.bbb/');
      expect(result.scheme)
        .toEqual({pattern: '*', value: 'http', result: true});
    });

    it('should include port in debug object', function () {
      pattern = new Pattern('*://aaa.bbb/');
      const result = pattern.debug('http://aaa.bbb/');
      expect(result.port)
        .toEqual({pattern: null, value: '80', result: true});
    });

  });

});
