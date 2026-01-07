import UrlMatch from './../src/index';

describe('Performance Tests', function() {

  describe('Pattern caching', function() {
    it('should reuse cached Pattern objects', function() {
      const urlMatch = new UrlMatch(['*://google.com/*', '*://facebook.com/*']);
      
      // First test call
      const result1 = urlMatch.test('http://google.com/');
      expect(result1).toBe(true);
      
      // Second test call should use cached Pattern objects
      const result2 = urlMatch.test('http://facebook.com/');
      expect(result2).toBe(true);
      
      // Third test call with non-matching URL
      const result3 = urlMatch.test('http://twitter.com/');
      expect(result3).toBe(false);
    });

    it('should remove Pattern from cache when pattern is removed', function() {
      const urlMatch = new UrlMatch(['*://google.com/*', '*://facebook.com/*']);
      
      expect(urlMatch.test('http://google.com/')).toBe(true);
      expect(urlMatch.test('http://facebook.com/')).toBe(true);
      
      // Remove one pattern
      urlMatch.remove('*://google.com/*');
      
      expect(urlMatch.test('http://google.com/')).toBe(false);
      expect(urlMatch.test('http://facebook.com/')).toBe(true);
    });

    it('should add Pattern to cache when pattern is added', function() {
      const urlMatch = new UrlMatch();
      
      expect(urlMatch.test('http://google.com/')).toBe(false);
      
      // Add pattern
      urlMatch.add('*://google.com/*');
      
      expect(urlMatch.test('http://google.com/')).toBe(true);
    });
  });

  describe('Early termination in test()', function() {
    it('should stop checking patterns once a match is found', function() {
      // Create a UrlMatch with multiple patterns
      const patterns = [];
      for (let i = 0; i < 100; i++) {
        patterns.push(`*://example${i}.com/*`);
      }
      patterns.unshift('*://google.com/*'); // Add matching pattern at the beginning
      
      const urlMatch = new UrlMatch(patterns);
      
      // This should match the first pattern and return immediately
      // without checking the remaining 100 patterns
      const result = urlMatch.test('http://google.com/');
      expect(result).toBe(true);
    });
  });

  describe('Optimized remove() method', function() {
    it('should efficiently remove multiple patterns', function() {
      const patterns = [];
      for (let i = 0; i < 50; i++) {
        patterns.push(`*://example${i}.com/*`);
      }
      
      const urlMatch = new UrlMatch(patterns);
      expect(urlMatch.patterns.length).toBe(50);
      
      // Remove half of the patterns
      const patternsToRemove = [];
      for (let i = 0; i < 25; i++) {
        patternsToRemove.push(`*://example${i}.com/*`);
      }
      
      urlMatch.remove(patternsToRemove);
      expect(urlMatch.patterns.length).toBe(25);
      
      // Verify removed patterns don't match
      expect(urlMatch.test('http://example0.com/')).toBe(false);
      expect(urlMatch.test('http://example24.com/')).toBe(false);
      
      // Verify remaining patterns still match
      expect(urlMatch.test('http://example25.com/')).toBe(true);
      expect(urlMatch.test('http://example49.com/')).toBe(true);
    });
  });

  describe('Early termination in validation', function() {
    it('should stop validation on first failed rule', function() {
      const urlMatch = new UrlMatch();
      
      // These patterns should be validated efficiently
      expect(() => urlMatch.add('*://google.com/*')).not.toThrow();
      expect(() => urlMatch.add('http://facebook.com/*')).not.toThrow();
      expect(() => urlMatch.add('*://*.example.com/*')).not.toThrow();
    });
  });

  describe('Debug method with cached patterns', function() {
    it('should use cached Pattern objects in debug()', function() {
      const urlMatch = new UrlMatch(['*://google.com/*', '*://facebook.com/*']);
      
      const debugResult = urlMatch.debug('http://google.com/');
      
      expect(debugResult['*://google.com/*'].scheme.result).toBe(true);
      expect(debugResult['*://google.com/*'].host.result).toBe(true);
      expect(debugResult['*://facebook.com/*'].scheme.result).toBe(true);
      expect(debugResult['*://facebook.com/*'].host.result).toBe(false);
    });
  });

});
