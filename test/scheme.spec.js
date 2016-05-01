import Scheme from './../src/scheme';


describe('Scheme', function() {

  let scheme;

  beforeEach(function() {
    scheme = new Scheme();
  });

  describe('validation', function() {

    it('should not validate if empty', function() {
      expect(scheme.validate()).toBe(false);
      expect(scheme.validate('')).toBe(false);
    });

    it('should validate asterisk', function() {
      expect(scheme.validate('*')).toBe(true);
    });

    it('should not validate more than one asterisk', function() {
      expect(scheme.validate('**')).toBe(false);
      expect(scheme.validate('*a*')).toBe(false);
      expect(scheme.validate('**a')).toBe(false);
      expect(scheme.validate('a**')).toBe(false);
      expect(scheme.validate('a**b')).toBe(false);
      expect(scheme.validate('*a*b')).toBe(false);
      expect(scheme.validate('a*b*')).toBe(false);
      expect(scheme.validate('a*b*c')).toBe(false);
    });

    it('should validate string of characters', function() {
      expect(scheme.validate('aaa')).toBe(true);
      expect(scheme.validate('http')).toBe(true);
      expect(scheme.validate('https')).toBe(true);
    });

    it('should not validate numbers', function() {
      expect(scheme.validate('123')).toBe(false);
      expect(scheme.validate('aaa123')).toBe(false);
      expect(scheme.validate('123bbb')).toBe(false);
      expect(scheme.validate('aaa123bbb')).toBe(false);
    });

    it('should not validate special characters', function() {
      expect(scheme.validate('-')).toBe(false);
      expect(scheme.validate('?')).toBe(false);
      expect(scheme.validate('!')).toBe(false);
      expect(scheme.validate('aaa-')).toBe(false);
      expect(scheme.validate('-aaa')).toBe(false);
      expect(scheme.validate('aaa-bbb')).toBe(false);
    });

  });

  describe('sanitize', function() {

    it('should sanitize *', function() {
      expect(scheme.sanitize('*')).toEqual(/^https?$/);
    });

    it('should sanitize custom protocol', function() {
      expect(scheme.sanitize('http')).toEqual(/^http$/);
      expect(scheme.sanitize('https')).toEqual(/^https$/);
    });

  });

  describe('test', function() {

    it('should match only specific scheme when provided', function() {
      expect(scheme.test('aaa', scheme.sanitize('aaaaaa'))).toBe(false);
      expect(scheme.test('aaa', scheme.sanitize('aaabbb'))).toBe(false);
      expect(scheme.test('aaa', scheme.sanitize('bbbaaa'))).toBe(false);
      expect(scheme.test('aaa', scheme.sanitize('bbb'))).toBe(false);
    });

    return it('should only match `http` or `https` on universal pattern', function() {
      const pattern = scheme.sanitize('*');
      expect(scheme.test('http', pattern)).toBe(true);
      expect(scheme.test('https', pattern)).toBe(true);
      expect(scheme.test('aaa', pattern)).toBe(false);
    });

  });

});
