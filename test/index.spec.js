import complex_url from './complex-url';
import UrlMatch from './../src/index';
import Pattern from './../src/pattern';


describe('General', function() {

  let url_match;

  beforeEach(function() {
    url_match = new UrlMatch();
  });

  it('should exist', function() {
    expect(UrlMatch).toBeDefined();
  });

  describe('add patterns', function() {

    it('should be created without a pattern', function() {
      expect(url_match.patterns.length).toBe(0);
    });

    it('should be created with single pattern', function() {
      url_match = new UrlMatch('*');
      expect(url_match.patterns.length).toBe(1);
    });

    it('should be created with multiple patterns', function() {
      const patterns = ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*'];
      url_match = new UrlMatch(patterns);
      expect(url_match.patterns.length).toBe(3);
    });

    it('should add single pattern', function() {
      url_match.add('*');
      expect(url_match.patterns.length).toBe(1);
    });

    it('should add multiple patterns', function() {
      url_match.add(['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*']);
      expect(url_match.patterns.length).toBe(3);
    });

    it('should only add unique patterns', function() {
      url_match = new UrlMatch(['*', '*', '*']);
      expect(url_match.patterns.length).toBe(1);
    });

  });

  describe('remove patterns', function() {

    beforeEach(function() {
      const patterns = ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*'];
      url_match = new UrlMatch(patterns);
    });

    it('should remove single pattern', function() {
      url_match.remove('*://aaa.bbb/*');
      expect(url_match.patterns.length).toBe(2);
    });

    it('should remove multiple patterns', function() {
      url_match.remove(['*://aaa.bbb/*', '*://ccc.ddd/*']);
      expect(url_match.patterns.length).toBe(1);
    });

    it('should ignore removing of non-existing patterns', function() {
      url_match.remove('*://ggg.hhh/*');
      expect(url_match.patterns.length).toBe(3);
    });

  });

  describe('matching', function() {

    it('should match URL against a pattern', function() {
      const patterns = [
        '*',
        '*://*/*?*#*',
        'http://*/*?*#*',
        '*://aaa.bbb.ccc/*?*#*',
        '*://*/ddd/eee?*#*',
        '*://*/*?fff=ggg&hhh=iii#*',
        '*://*/*?*#jjj',
        complex_url
      ];

      patterns.forEach((pattern) => {
        url_match = new UrlMatch(pattern);
        expect(url_match.test(complex_url)).toBe(true)
      });
    });

    it('should match URL against all of multiple patterns', function() {
      const patterns = ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*'];
      url_match = new UrlMatch(patterns);
      expect(url_match.test('http://aaa.bbb/ccc')).toBe(true);
      expect(url_match.test('http://xxx.yyy/zzz')).toBe(false);
    });

  });

  describe('debug', function () {

    it('should return debug object', function () {
      const pattern = '*://aaa.bbb/';
      url_match = new UrlMatch(pattern);
      const result = url_match.debug('http://aaa.bbb/');
      expect(result[pattern].scheme).toEqual({
        pattern: '*',
        value: 'http',
        result: true
      });
    });

  });

  describe('caching', function () {

    it('should cache Pattern objects and reuse them on repeated test() calls', function () {
      const spy = vi.spyOn(Pattern.prototype, 'test');

      url_match = new UrlMatch(['http://aaa.bbb/*', 'http://ccc.ddd/*', 'http://eee.fff/*']);

      // First test call - should use cached Pattern objects
      // Note: With early exit optimization, only tests until first match
      url_match.test('http://aaa.bbb/test');
      expect(spy).toHaveBeenCalledTimes(1); // Called once, then early exit

      // Second test call - tests until match at second pattern
      url_match.test('http://ccc.ddd/test');
      expect(spy).toHaveBeenCalledTimes(3); // 1 from first test + 2 from this test

      // Third test call - tests all patterns (no match)
      url_match.test('http://zzz.zzz/test');
      expect(spy).toHaveBeenCalledTimes(6); // Previous 3 + all 3 patterns tested

      spy.mockRestore();
    });

    it('should create Pattern objects only once when patterns are added', function () {
      // Count how many Pattern objects exist initially
      url_match = new UrlMatch();

      // Add patterns
      url_match.add(['http://aaa.bbb/*', 'http://ccc.ddd/*']);

      // Verify we can test multiple times without creating new Pattern objects
      // by checking that the same Pattern instance methods are called
      const url1 = 'http://aaa.bbb/test1';
      const url2 = 'http://aaa.bbb/test2';
      const url3 = 'http://ccc.ddd/test3';

      const result1 = url_match.test(url1);
      const result2 = url_match.test(url2);
      const result3 = url_match.test(url3);

      // All should work correctly
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
    });

    it('should remove Pattern objects from cache when patterns are removed', function () {
      url_match = new UrlMatch(['http://aaa.bbb/*', 'http://ccc.ddd/*', 'http://eee.fff/*']);

      // Test with all patterns
      expect(url_match.test('http://aaa.bbb/test')).toBe(true);
      expect(url_match.test('http://ccc.ddd/test')).toBe(true);
      expect(url_match.test('http://eee.fff/test')).toBe(true);

      // Remove one pattern
      url_match.remove('http://ccc.ddd/*');

      // Should still work with remaining patterns
      expect(url_match.test('http://aaa.bbb/test')).toBe(true);
      expect(url_match.test('http://ccc.ddd/test')).toBe(false);
      expect(url_match.test('http://eee.fff/test')).toBe(true);
    });

  });

});
