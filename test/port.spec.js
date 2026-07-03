import Port from './../src/port';


describe('Port', function() {

  let port;

  beforeEach(function() {
    port = new Port();
  });

  describe('validate', function() {

    it('should validate missing port', function() {
      expect(port.validate()).toBe(true);
      expect(port.validate(null)).toBe(true);
    });

    it('should validate asterisk', function() {
      expect(port.validate('*')).toBe(true);
    });

    it('should validate port number', function() {
      expect(port.validate('80')).toBe(true);
      expect(port.validate('8080')).toBe(true);
      expect(port.validate('65535')).toBe(true);
    });

    it('should validate partial wildcard', function() {
      expect(port.validate('3*')).toBe(true);
      expect(port.validate('*3')).toBe(true);
      expect(port.validate('3*0')).toBe(true);
    });

    it('should not validate anything else', function() {
      expect(port.validate('')).toBe(false);
      expect(port.validate('abc')).toBe(false);
      expect(port.validate('80a')).toBe(false);
      expect(port.validate('123456')).toBe(false);
      expect(port.validate('3**')).toBe(false);
    });

  });

  describe('sanitize', function() {

    it('should sanitize asterisk', function() {
      expect(port.sanitize('*')).toEqual(/^\d+$/);
    });

    it('should sanitize specific port', function() {
      expect(port.sanitize('8080')).toEqual(/^8080$/);
    });

    it('should sanitize partial wildcard', function() {
      expect(port.sanitize('3*')).toEqual(/^3\d*$/);
    });

    it('should sanitize missing port to null', function() {
      expect(port.sanitize(null)).toEqual(null);
    });

  });

  describe('test', function() {

    it('should match any port when pattern is missing', function() {
      expect(port.test('8080', null)).toBe(true);
      expect(port.test(null, null)).toBe(true);
    });

    it('should match any port number on asterisk', function() {
      const pattern = port.sanitize('*');
      expect(port.test('80', pattern)).toBe(true);
      expect(port.test('8080', pattern)).toBe(true);
      expect(port.test(null, pattern)).toBe(false);
    });

    it('should match specific port', function() {
      const pattern = port.sanitize('8080');
      expect(port.test('8080', pattern)).toBe(true);
      expect(port.test('80', pattern)).toBe(false);
      expect(port.test(null, pattern)).toBe(false);
    });

    it('should match port range on partial wildcard', function() {
      const pattern = port.sanitize('3*');
      expect(port.test('3000', pattern)).toBe(true);
      expect(port.test('3001', pattern)).toBe(true);
      expect(port.test('3999', pattern)).toBe(true);
      expect(port.test('3', pattern)).toBe(true);
      expect(port.test('8080', pattern)).toBe(false);
      expect(port.test('13000', pattern)).toBe(false);
    });

  });

});
