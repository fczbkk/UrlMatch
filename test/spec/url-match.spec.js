(function() {
  describe('URL Match', function() {
    it('should accept single pattern', function() {});
    it('should accept array of patterns', function() {});
    it('should add pattern', function() {});
    it('should remove pattern', function() {});
    return it('should match URL against multiple patterns', function() {});
  });

  describe('Pattern', function() {
    it('should validate', function() {});
    it('should not validate if scheme, host or path is missing', function() {});
    it('should not validate if scheme operator is incorrect', function() {});
    it('should sanitize', function() {});
    it('should split pattern into scheme, host and path parts', function() {});
    it('should match any URL when <all_urls> is used', function() {});
    it('should match any URL when * is used', function() {});
    it('should match any URL when *://*/* is used', function() {});
    return it('should match correctly when specific URL is used', function() {});
  });

  describe('Scheme', function() {
    it('should validate', function() {});
    it('should sanitize', function() {});
    it('should match only http and https schemes when * is used', function() {});
    return it('should match only specific scheme when provided', function() {});
  });

  describe('Host', function() {
    it('should validate', function() {});
    it('should not validate if * is not followed by . or /', function() {});
    it('should not validate if * is not at the beginning', function() {});
    it('should sanitize', function() {});
    it('should match any host when * is used', function() {});
    it('should match correct hosts when *.hostname is used', function() {});
    return it('should match correct hosts when specific hostname is used', function() {});
  });

  describe('Path', function() {
    it('should validate', function() {});
    it('should sanitize', function() {});
    it('should match any path when * is used', function() {});
    it('should match correct paths when path with * is specified', function() {});
    return it('should match correct paths specific when path is specified', function() {});
  });

}).call(this);
