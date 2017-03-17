import UrlMatch from './../src/';


describe('Real life examples', function() {

  it('should do universal match', function() {
    const my_match = new UrlMatch('*');
    expect(my_match.test('http://www.google.com/')).toBe(true);
    expect(my_match.test('https://www.google.com/preferences?hl=en')).toBe(true);
    expect(my_match.test('this.is.not/valid.url')).toBe(false);
  });

  it('should do simple match', function() {
    const my_match = new UrlMatch('*://*.google.com/*');
    expect(my_match.test('http://www.google.com/')).toBe(true);
    expect(my_match.test('http://calendar.google.com/')).toBe(true);
    expect(my_match.test('https://www.google.com/preferences?hl=en')).toBe(true);
    expect(my_match.test('http://www.facebook.com/')).toBe(false);
    expect(my_match.test('http://www.google.sucks.com/')).toBe(false);
  });

  it('should work on URLs with port', function() {
    const my_match = new UrlMatch('*://*.google.com/*');
    expect(my_match.test('http://www.google.com:8080/')).toBe(true);
  });

  it('should do match on multiple patterns', function() {
    const my_match = new UrlMatch(['*://*.google.com/*', '*://*.facebook.com/*']);
    expect(my_match.test('http://www.google.com/')).toBe(true);
    expect(my_match.test('http://www.facebook.com/')).toBe(true);
    expect(my_match.test('http://www.apple.com/')).toBe(false);
  });

  it('should handle adding and removing of patterns', function() {
    const my_match = new UrlMatch('*://*.google.com/*');
    expect(my_match.test('http://www.google.com/')).toBe(true);
    expect(my_match.test('http://www.facebook.com/')).toBe(false);
    my_match.add('*://*.facebook.com/*');
    expect(my_match.test('http://www.google.com/')).toBe(true);
    expect(my_match.test('http://www.facebook.com/')).toBe(true);
    my_match.remove('*://*.google.com/*');
    expect(my_match.test('http://www.google.com/')).toBe(false);
    expect(my_match.test('http://www.facebook.com/')).toBe(true);
  });

  it('should handle localhost', function() {
    const my_match = new UrlMatch('*://*/aaa');
    expect(my_match.test('http://localhost/aaa')).toBe(true);
  });

  it('should handle localhost with port', function() {
    const my_match = new UrlMatch('*://*/aaa');
    expect(my_match.test('http://localhost:3000/aaa')).toBe(true);
  });

  it('should not require `/` after a domain name', function() {
    const my_match = new UrlMatch('http://google.com/');
    expect(my_match.test('http://google.com')).toBe(true);
  });

  it('should not require `/` after a domain name on general pattern', function() {
    const my_match = new UrlMatch('*://*/*');
    expect(my_match.test('http://google.com')).toBe(true);
  });

  it('should match missing 3rd level domain', function() {
    const my_match = new UrlMatch('*://*.aaa.com/');
    expect(my_match.test('http://aaa.com/')).toBe(true);
  });

  it('strict matching', function () {
    const my_match = new UrlMatch('http://*.aaa.com/*?!aaa=bbb');
    expect(my_match.test('http://www.aaa.com/?aaa=bbb')).toBe(true);
    expect(my_match.test('http://www.aaa.com/?aaa=bbb&ccc=ddd')).toBe(false);
    expect(my_match.test('http://www.aaa.com/?ccc=ddd')).toBe(false);
    expect(my_match.test('http://www.aaa.com/index.php?aaa=bbb')).toBe(true);
  });

  it('should match localhost on universal pattern', function () {
    const my_match = new UrlMatch('*');
    expect(my_match.test('http://localhost/')).toBe(true);
    expect(my_match.test('http://localhost:3000/')).toBe(true);
    expect(my_match.test('http://localhost:3000/aaa/bbb')).toBe(true);
  });

  it('should match localhost on specific pattern', function () {
    const my_match = new UrlMatch('*://*/aaa/bbb');
    expect(my_match.test('http://localhost/')).toBe(false);
    expect(my_match.test('http://localhost:3000/')).toBe(false);
    expect(my_match.test('http://localhost:3000/aaa/bbb')).toBe(true);
  });

  it('should match path commonly used by SPAs', function () {
    const pattern = '*://*/sample/context_paths/#/sample?sampleId=1234';
    const url =
      'http://localhost:3000/sample/context_paths/#/sample?sampleId=1234';
    const my_match = new UrlMatch(pattern);
    expect(my_match.test(url)).toBe(true);
  });

  it('should match fragment containing @', function () {
    const pattern = '*://*/CustomerPortal/#/Page/HOME@folder-35';
    const url = 'http://aaa.bbb/CustomerPortal/#/Page/HOME@folder-35';
    const my_match = new UrlMatch(pattern);
    expect(my_match.test(url)).toBe(true);
  });

});
