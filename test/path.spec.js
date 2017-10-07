import Path from './../src/path';


describe('Path', function() {

  let path;

  beforeEach(function() {
    path = new Path();
  });

  describe('validate', function() {

    it('should validate asterisk', function() {
      expect(path.validate('*')).toBe(true);
      expect(path.validate('*/*')).toBe(true);
      expect(path.validate('aaa*')).toBe(true);
      expect(path.validate('*aaa')).toBe(true);
      expect(path.validate('aaa*bbb')).toBe(true);
      expect(path.validate('*/aaa')).toBe(true);
      expect(path.validate('aaa/*')).toBe(true);
      expect(path.validate('aaa/*/bbb')).toBe(true);
    });

    return it('should validate specific path', function() {
      expect(path.validate('aaa')).toBe(true);
      expect(path.validate('aaa/')).toBe(true);
      expect(path.validate('aaa/bbb')).toBe(true);
      expect(path.validate('aaa/bbb/')).toBe(true);
    });

  });

  describe('sanitize', function() {});

  describe('test', function() {

    it('should match any path when * is used', function() {
      const pattern = path.sanitize('*');
      expect(path.test('', pattern)).toBe(true);
      expect(path.test('/', pattern)).toBe(true);
      expect(path.test('aaa', pattern)).toBe(true);
      expect(path.test('aaa/', pattern)).toBe(true);
      expect(path.test('aaa/bbb', pattern)).toBe(true);
      expect(path.test('aaa/bbb/', pattern)).toBe(true);
      expect(path.test('aaa/bbb.ccc', pattern)).toBe(true);
    });

    it('should match path containing uppercase letters when * is used', function() {
      const pattern = path.sanitize('*');
      expect(path.test('AAA', pattern)).toBe(true);
    });

    it('should match path containing underscore', function() {
      const pattern = path.sanitize('*');
      expect(path.test('aaa_bbb', pattern)).toBe(true);
    });

    it('should match correct paths when path with * is specified', function() {
      expect(path.test('aaa', path.sanitize('aaa*'))).toBe(true);
      expect(path.test('aaa/', path.sanitize('aaa*/'))).toBe(true);
      expect(path.test('aaa/', path.sanitize('aaa/*'))).toBe(true);
      expect(path.test('aaa/bbb.ccc', path.sanitize('aaa/bbb.ccc*'))).toBe(true);
      expect(path.test('aaa/bbb.ccc', path.sanitize('aaa/*.ccc'))).toBe(true);
      expect(path.test('aaa/bbb.ccc', path.sanitize('*/*.ccc'))).toBe(true);
    });

    it('should not match incorrect paths when path with * is specified', function() {
      expect(path.test('bbb', path.sanitize('aaa*'))).toBe(false);
      expect(path.test('bbb/', path.sanitize('aaa/*'))).toBe(false);
      expect(path.test('aaa/ccc', path.sanitize('aaa/*.ccc'))).toBe(false);
      expect(path.test('bbb.ccc', path.sanitize('*/*.ccc'))).toBe(false);
    });

    it('should assume trailing `/` is optional', function() {
      expect(path.test('', path.sanitize('/'))).toBe(true);
      expect(path.test('aaa', path.sanitize('aaa/'))).toBe(true);
      expect(path.test('aaa/bbb', path.sanitize('aaa/bbb/'))).toBe(true);
    });

    it('should assume trailing `/*` is present when matching', function() {
      expect(path.test('', path.sanitize('*'))).toBe(true);
      expect(path.test('aaa', path.sanitize('aaa/*'))).toBe(true);
      expect(path.test('aaa/bbb', path.sanitize('aaa/bbb/*'))).toBe(true);
    });

    it('should match correct paths specific when path is specified', function() {
      expect(path.test('', path.sanitize(''))).toBe(true);
      expect(path.test('aaa', path.sanitize('aaa'))).toBe(true);
      expect(path.test('aaa/bbb', path.sanitize('aaa/bbb'))).toBe(true);
      expect(path.test('aaa/bbb.ccc', path.sanitize('aaa/bbb.ccc'))).toBe(true);
    });

    it('should treat missing path as empty string', function() {
      const pattern = path.sanitize(null);
      expect(path.test(null, pattern)).toBe(true);
      expect(path.test('', pattern)).toBe(true);
      expect(path.test('aaa', pattern)).toBe(false);
    });

    it('should match path containing colon', function () {
      const pattern = path.sanitize('aaa*bbb');
      expect(path.test('aaa:bbb', pattern)).toBe(true);
    });

    it('should allow to use colon in pattern', function () {
      const pattern = path.sanitize('*:*');
      expect(path.test('aaa:bbb', pattern)).toBe(true);
    });

  });

});
