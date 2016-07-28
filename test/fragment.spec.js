import Fragment from './../src/fragment';


describe('Fragment', function() {

  let fragment;

  beforeEach(function() {
    fragment = new Fragment();
  });

  describe('validate', function() {

    it('should validate asterisk', function() {
      expect(fragment.validate('*')).toBe(true);
    });

    it('should not validate invalid characters', function() {
      expect(fragment.validate('#')).toBe(false);
    });

    it('should validate on combination of characters and asterisks', function() {
      expect(fragment.validate('aaa*bbb*ccc')).toBe(true);
    });

  });

  describe('sanitize', function() {

    it('should sanitize single asterisk', function() {
      expect(fragment.sanitize('*')).toEqual(/^.*$/);
    });

    it('should sanitize characters with single asterisk', function() {
      expect(fragment.sanitize('aaa*')).toEqual(/^aaa.*$/);
      expect(fragment.sanitize('*bbb')).toEqual(/^.*bbb$/);
      expect(fragment.sanitize('aaa*bbb')).toEqual(/^aaa.*bbb$/);
    });

    it('should sanitize characters with multiple asterisk', function() {
      expect(fragment.sanitize('aaa*bbb*ccc')).toEqual(/^aaa.*bbb.*ccc$/);
    });

    it('should escape question mark', function() {
      expect(fragment.sanitize('aaa*bbb*ccc')).toEqual(/^aaa.*bbb.*ccc$/);
    });

  });

  describe('test', function() {

    it('should match empty fragment on universal match', function() {
      const pattern = fragment.sanitize('*');
      expect(fragment.test(null, pattern)).toBe(true);
      expect(fragment.test('', pattern)).toBe(true);
    });

    it('should match any fragment on universal match', function() {
      const pattern = fragment.sanitize('*');
      expect(fragment.test('aaa', pattern)).toBe(true);
    });

    it('should match specific fragment', function() {
      const pattern = fragment.sanitize('aaa');
      expect(fragment.test('aaa', pattern)).toBe(true);
    });

    it('should match fragment with single asterisk', function() {
      const pattern = fragment.sanitize('aaa*');
      expect(fragment.test('aaa', pattern)).toBe(true);
      expect(fragment.test('aaabbb', pattern)).toBe(true);
    });

    it('should not match invalid fragment with single asterisk', function() {
      const pattern = fragment.sanitize('aaa*');
      expect(fragment.test('bbb', pattern)).toBe(false);
      expect(fragment.test('bbbaaa', pattern)).toBe(false);
    });

    it('should match fragment with multiple asterisks', function() {
      const pattern = fragment.sanitize('aaa*bbb*');
      expect(fragment.test('aaabbb', pattern)).toBe(true);
      expect(fragment.test('aaaxxxbbbxxx', pattern)).toBe(true);
    });

    it('should not match invalid fragment with multiple asterisks', function() {
      const pattern = fragment.sanitize('aaa*bbb*');
      expect(fragment.test('xxx', pattern)).toBe(false);
      expect(fragment.test('xxxaaa', pattern)).toBe(false);
      expect(fragment.test('xxxaaabbb', pattern)).toBe(false);
    });

    it('should match fragment with question mark', function () {
      const pattern = fragment.sanitize('aaa?bbb');
      expect(fragment.test('aaa?bbb', pattern)).toBe(true);
    });

    it('should match fragment with slash', function () {
      const pattern = fragment.sanitize('aaa/bbb');
      expect(fragment.test('aaa/bbb', pattern)).toBe(true);
    });

  });

});
