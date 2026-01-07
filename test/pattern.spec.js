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

  });

  describe('debug', function () {

    it('should return debug object', function () {
      pattern = new Pattern('*://aaa.bbb/');
      const result = pattern.debug('http://aaa.bbb/');
      expect(result.scheme)
        .toEqual({pattern: '*', value: 'http', result: true});
    });

  });

});
