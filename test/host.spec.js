import Host from './../src/host';


describe('Host', function() {

  let host;

  beforeEach(function() {
    host = new Host();
  });

  describe('validate', function() {

    it('should not validate if empty', function() {
      expect(host.validate()).toBe(false);
      expect(host.validate('')).toBe(false);
    });

    it('should validate asterisk', function() {
      expect(host.validate('*')).toBe(true);
    });

    it('should not validate multiple asterisks', function() {
      expect(host.validate('**')).toBe(false);
      expect(host.validate('**.aaa')).toBe(false);
      expect(host.validate('**.aaa.bbb')).toBe(false);
    });

    it('should validate domain without subdomain', function() {
      expect(host.validate('aaa.bbb')).toBe(true);
    });

    it('should validate domain with any level of subdomains', function() {
      expect(host.validate('aaa.bbb.ccc')).toBe(true);
      expect(host.validate('aaa.bbb.ccc.ddd')).toBe(true);
    });

    it('should validate asterisk at the beginning of domain', function() {
      expect(host.validate('*.aaa')).toBe(true);
      expect(host.validate('*.aaa.bbb')).toBe(true);
    });

    it('should not validate if asterisk is not followed by a dot', function() {
      expect(host.validate('*aaa')).toBe(false);
      expect(host.validate('*aaa.bbb')).toBe(false);
    });

    it('should not validate if asterisk is not at the beginning', function() {
      expect(host.validate('aaa*')).toBe(false);
      expect(host.validate('aaa*bbb')).toBe(false);
    });

    it('should not validate characters except letters, numbers and -', function() {
      expect(host.validate('aaa?bbb.ccc')).toBe(false);
      expect(host.validate('aaa_bbb.ccc')).toBe(false);
      expect(host.validate('aaa+bbb.ccc')).toBe(false);
    });

    it('should not validate when starts or ends with dot or hyphen', function() {
      expect(host.validate('-aaa.bbb')).toBe(false);
      expect(host.validate('.aaa.bbb')).toBe(false);
      expect(host.validate('aaa.bbb-')).toBe(false);
      expect(host.validate('aaa.bbb.')).toBe(false);
    });

  });

  describe('sanitize', function() {

    it('should sanitize *', function() {
      expect(host.sanitize('*')).toEqual(/^[a-z0-9-.]+$/);
    });

    it('should sanitize host without asterisk', function() {
      expect(host.sanitize('aaa')).toEqual(/^aaa$/);
    });

    it('should sanitize host with asterisk', function() {
      expect(host.sanitize('*.aaa')).toEqual(/^([a-z0-9-.]+\.)?aaa$/);
    });

  });

  describe('match', function() {

    it('should match any host when * is used', function() {
      const pattern = host.sanitize('*');
      expect(host.test('aaa', pattern)).toBe(true);
      expect(host.test('aaa.bbb', pattern)).toBe(true);
      expect(host.test('aaa.bbb.ccc', pattern)).toBe(true);
    });

    it('should match correct hosts when *.hostname is used', function() {
      expect(host.test('aaa.bbb', host.sanitize('*.bbb'))).toBe(true);
      expect(host.test('aaa.bbb.ccc', host.sanitize('*.ccc'))).toBe(true);
      expect(host.test('aaa.bbb.ccc', host.sanitize('*.bbb.ccc'))).toBe(true);
    });

    it('should not match incorrect hosts when *.hostname is used', function() {
      expect(host.test('aaa.bbb', host.sanitize('*.xxx'))).toBe(false);
      expect(host.test('aaa.bbb.ccc', host.sanitize('*.xxx'))).toBe(false);
      expect(host.test('aaa.bbb.ccc', host.sanitize('*.bbb.xxx'))).toBe(false);
    });

    it('should match correct hosts when specific hostname is used', function() {
      expect(host.test('aaa', host.sanitize('aaa'))).toBe(true);
      expect(host.test('aaa.bbb', host.sanitize('aaa.bbb'))).toBe(true);
      expect(host.test('aaa.bbb.ccc', host.sanitize('aaa.bbb.ccc'))).toBe(true);
    });

    it('should not match incorrect hosts when specific hostname is used', function() {
      expect(host.test('aaa', host.sanitize('xxx'))).toBe(false);
      expect(host.test('aaa.bbb', host.sanitize('xxx.bbb'))).toBe(false);
      expect(host.test('aaa.bbb', host.sanitize('aaa.xxx'))).toBe(false);
      expect(host.test('aaa.bbb.ccc', host.sanitize('xxx.bbb.ccc'))).toBe(false);
      expect(host.test('aaa.bbb.ccc', host.sanitize('aaa.xxx.ccc'))).toBe(false);
      expect(host.test('aaa.bbb.ccc', host.sanitize('aaa.bbb.xxx'))).toBe(false);
    });

  });

});
