import complex_url from './complex-url';
import UrlMatch from './../src/index';


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

});
