import Params from './../src/params';


describe('Params', function() {

  let params;

  beforeEach(function() {
    params = new Params();
  });

  describe('validate', function() {

    it('should validate asterisk', function() {
      expect(params.validate('*')).toBe(true);
    });

    it('should validate full pair (key and value defined)', function() {
      expect(params.validate('aaa=bbb')).toBe(true);
    });

    it('should validate valueless param', function() {
      expect(params.validate('aaa')).toBe(true);
      expect(params.validate('aaa=bbb&ccc')).toBe(true);
    });

    it('should validate on multiple pairs', function() {
      expect(params.validate('aaa=bbb&ccc=ddd')).toBe(true);
      expect(params.validate('aaa=bbb&ccc=ddd&eee=fff')).toBe(true);
    });

    it('should validate on pair with asterisk instead of key or value', function() {
      expect(params.validate('*=*')).toBe(true);
      expect(params.validate('aaa=*')).toBe(true);
      expect(params.validate('*=aaa')).toBe(true);
      expect(params.validate('aaa=*&*=bbb')).toBe(true);
    });

    it('should not validate multiple equal signs', function() {
      expect(params.validate('==')).toBe(false);
      expect(params.validate('aaa==bbb')).toBe(false);
    });

    it('should not validate pairs undivided by ampersand', function() {
      expect(params.validate('aaa=bbb=')).toBe(false);
      expect(params.validate('=aaa=bbb')).toBe(false);
      expect(params.validate('aaa=bbb=ccc')).toBe(false);
    });

    it('should not validate an asterisk sandwitch', function() {
      expect(params.validate('aaa=*=bbb')).toBe(false);
    });

    it('should not validate single equal sign', function() {
      expect(params.validate('=')).toBe(false);
    });

  });

  describe('sanitize', function() {

    it('should return empty hash on empty', function() {
      expect(params.sanitize()).toEqual([]);
    });

    it('should return empty hash on single asterisk', function() {
      expect(params.sanitize('*')).toEqual([]);
    });

    it('should handle valueless pair', function() {
      expect(params.sanitize('aaa')).toEqual([
        'aaa=?'
      ]);
      expect(params.sanitize('aaa=')).toEqual([
        'aaa=?'
      ]);
    });

    it('should break the single pair pattern down to key/val pairs', function() {
      expect(params.sanitize('aaa=bbb')).toEqual([
        'aaa=bbb'
      ]);
    });

    it('should break the multi pair pattern down to key/val pairs', function() {
      expect(params.sanitize('aaa=bbb&ccc=ddd')).toEqual([
        'aaa=bbb',
        'ccc=ddd'
      ]);
    });

    it('should replace asterisks in keys with universal matches', function() {
      expect(params.sanitize('*=bbb')).toEqual([
        '.+=bbb'
      ]);
    });

    it('should replace asterisks in vals with universal matches', function() {
      expect(params.sanitize('aaa=*')).toEqual([
        'aaa=?.*'
      ]);
    });

    it('should replace partial asterisks with universal matches', function() {
      expect(params.sanitize('aaa*=*bbb&ccc*ddd=*eee*')).toEqual([
        'aaa.*=.*bbb',
        'ccc.*ddd=.*eee.*'
      ]);
    });

    it('should escape square brackets', function() {
      expect(params.sanitize('aaa=[]')).toEqual([
        'aaa=\\[\\]'
      ]);
    });

    it('should escape nested square brackets', function() {
      expect(params.sanitize('aaa=[[]]')).toEqual([
        'aaa=\\[\\[\\]\\]'
      ]);
    });

    it('should escape serialized JSON data', function() {
      expect(params.sanitize('aaa=[[]]')).toEqual([
        'aaa=\\[\\[\\]\\]'
      ]);
    });

  });

  describe('test', function() {

    it('should match empty params on universal match', function() {
      const pattern = params.sanitize('*');
      expect(params.test('', pattern)).toBe(true);
    });

    it('should match any params on universal match', function() {
      const pattern = params.sanitize('*');
      expect(params.test('aaa', pattern)).toBe(true);
      expect(params.test('aaa=bbb', pattern)).toBe(true);
      expect(params.test('aaa=bbb&ccc=ddd', pattern)).toBe(true);
    });

    it('should match at least one param on asterisk to asterisk match', function() {
      const pattern = params.sanitize('*=*');
      expect(params.test('', pattern)).toBe(false);
      expect(params.test('aaa', pattern)).toBe(true);
      expect(params.test('aaa=bbb', pattern)).toBe(true);
      expect(params.test('aaa=bbb&ccc=ddd', pattern)).toBe(true);
    });

    it('should match single key/val pair', function() {
      const pattern = params.sanitize('aaa=bbb');

      expect(params.test('aaa=bbb', pattern)).toBe(true);

      expect(params.test('aaa', pattern)).toBe(false);
      expect(params.test('bbb', pattern)).toBe(false);
      expect(params.test('bbb=aaa', pattern)).toBe(false);
      expect(params.test('ccc=ddd', pattern)).toBe(false);
    });

    it('should match single key/val pair among many pairs', function() {
      const pattern = params.sanitize('aaa=bbb');

      expect(params.test('aaa=bbb&ccc=ddd', pattern)).toBe(true);
      expect(params.test('ccc=ddd&aaa=bbb&eee=fff', pattern)).toBe(true);

      expect(params.test('bbb=aaa&ccc=ddd', pattern)).toBe(false);
      expect(params.test('ccc=ddd&eee=fff&ggg=hhh', pattern)).toBe(false);
    });

    it('should match multiple key/val pairs in any order', function() {
      const pattern = params.sanitize('aaa=bbb&ccc=ddd');
      expect(params.test('ccc=ddd&aaa=bbb', pattern)).toBe(true);
      expect(params.test('eee=fff&aaa=bbb&ccc=ddd', pattern)).toBe(true);
    });

    it('should match pair with universal key', function() {
      const pattern = params.sanitize('aaa=*');
      expect(params.test('aaa=bbb', pattern)).toBe(true);
    });

    it('should match pair with universal val', function() {
      const pattern = params.sanitize('*=bbb');
      expect(params.test('aaa=bbb', pattern)).toBe(true);
    });

    it('should match partial wildcard in key', function() {
      const pattern = params.sanitize('aaa*ccc=ddd');
      expect(params.test('aaabbbccc=ddd', pattern)).toBe(true);
    });

    it('should match partial wildcard in val', function() {
      const pattern = params.sanitize('aaa=bbb*ddd');
      expect(params.test('aaa=bbbcccddd', pattern)).toBe(true);
    });

    it('should match val with square brackets', function() {
      const pattern = params.sanitize('aaa=[bbb]');
      expect(params.test('aaa=[bbb]', pattern)).toBe(true);
    });

    it('should match val with asterisk in square brackets', function() {
      const pattern = params.sanitize('aaa=bbb[*]ddd');
      expect(params.test('aaa=bbb[ccc]ddd', pattern)).toBe(true);
    });

    it('should match val with nested brackets', function() {
      const pattern = params.sanitize('aaa=[[*]]');
      expect(params.test('aaa=[[bbb]]', pattern)).toBe(true);
    });

    it('should match val with serialized JSON data', function() {
      const pattern = params.sanitize('aaa={bbb:*,ddd:[*,fff]}');
      expect(params.test('aaa={bbb:ccc,ddd:[eee,fff]}', pattern)).toBe(true);
    });

    it('should match unwanted val', function() {
      let pattern;

      pattern = params.sanitize('aaa');
      expect(params.test('aaa', pattern)).toBe(true);
      expect(params.test('aaa=', pattern)).toBe(true);
      expect(params.test('aaa=bbb', pattern)).toBe(false);

      pattern = params.sanitize('aaa=');
      expect(params.test('aaa', pattern)).toBe(true);
      expect(params.test('aaa=', pattern)).toBe(true);
      expect(params.test('aaa=bbb', pattern)).toBe(false);
    });

  });

  describe('strict mode', function () {

    it('should set `is_strict` property', function () {
      params.sanitize('!aaa=*');
      expect(params.is_strict).toEqual(true);
    });

    it('should match known params when in strict mode', function () {
      const pattern = params.sanitize('!aaa=*');
      expect(params.test('aaa=bbb', pattern)).toBe(true);
    });

    it('should not match unknown params when in strict mode', function () {
      const pattern = params.sanitize('!aaa=*');
      expect(params.test('aaa=bbb&ccc=ddd', pattern)).toBe(false);
      expect(params.test('ccc=ddd', pattern)).toBe(false);
    });

    it('should not match any params when empty in strict mode', function () {
      const pattern = params.sanitize('!');
      expect(params.test('aaa=bbb', pattern)).toBe(false);
    });

    it('should match empty params when empty in strict mode', function () {
      const pattern = params.sanitize('!');
      expect(params.test('', pattern)).toBe(true);
    });

    it('should match generic key param in strict mode', function () {
      const pattern = params.sanitize('!*=aaa');
      expect(params.test('bbb=aaa', pattern)).toBe(true);
      expect(params.test('ccc=aaa', pattern)).toBe(true);
    });

    it('should match multiple key params in strict mode', function () {
      const pattern = params.sanitize('!*=aaa');
      expect(params.test('bbb=aaa&ccc=aaa', pattern)).toBe(true);
    });

    it('should match multiple generic key params in strict mode', function () {
      const pattern = params.sanitize('!*=aaa&*=ccc');
      expect(params.test('bbb=aaa&bbb=ccc', pattern)).toBe(true);
      expect(params.test('bbb=aaa&bbb=ccc&xxx=yyy', pattern)).toBe(false);
    });

    it('should match multiple val params in strict mode', function () {
      const pattern = params.sanitize('!aaa=*');
      expect(params.test('aaa=bbb&aaa=ccc', pattern)).toBe(true);
    });

    it('should not match one of multiple params in strict mode', function () {
      const pattern = params.sanitize('!aaa=*ccc');
      expect(params.test('aaa=bbbccc&aaa=xxx', pattern)).toBe(false);
    });

  });
});
