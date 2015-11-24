describe 'Real life examples', ->

  it 'should do universal match', ->
    my_match = new UrlMatch '*'
    expect(my_match.test 'http://www.google.com/').toBe true
    expect(my_match.test 'https://www.google.com/preferences?hl=en').toBe true
    expect(my_match.test 'this.is.not/valid.url').toBe false

  it 'should do simple match', ->
    my_match = new UrlMatch '*://*.google.com/*'
    expect(my_match.test 'http://www.google.com/').toBe true
    expect(my_match.test 'http://calendar.google.com/').toBe true
    expect(my_match.test 'https://www.google.com/preferences?hl=en').toBe true
    expect(my_match.test 'http://www.facebook.com/').toBe false
    expect(my_match.test 'http://www.google.sucks.com/').toBe false

  it 'should work on URLs with port', ->
    my_match = new UrlMatch '*://*.google.com/*'
    expect(my_match.test 'http://www.google.com:8080/').toBe true

  it 'should do match on multiple patterns', ->
    my_match = new UrlMatch ['*://*.google.com/*', '*://*.facebook.com/*']
    expect(my_match.test 'http://www.google.com/').toBe true
    expect(my_match.test 'http://www.facebook.com/').toBe true
    expect(my_match.test 'http://www.apple.com/').toBe false

  it 'should handle adding and removing of patterns', ->
    my_match = new UrlMatch '*://*.google.com/*'
    expect(my_match.test 'http://www.google.com/').toBe true
    expect(my_match.test 'http://www.facebook.com/').toBe false

    my_match.add '*://*.facebook.com/*'
    expect(my_match.test 'http://www.google.com/').toBe true
    expect(my_match.test 'http://www.facebook.com/').toBe true

    my_match.remove '*://*.google.com/*'
    expect(my_match.test 'http://www.google.com/').toBe false
    expect(my_match.test 'http://www.facebook.com/').toBe true

  it 'should handle localhost', ->
    my_match = new UrlMatch '*://*/aaa'
    expect(my_match.test 'http://localhost/aaa').toBe true

  it 'should handle localhost with port', ->
    my_match = new UrlMatch '*://*/aaa'
    expect(my_match.test 'http://localhost:3000/aaa').toBe true

  it 'should not require `/` after a domain name', ->
    my_match = new UrlMatch 'http://google.com/'
    expect(my_match.test 'http://google.com').toBe true

  it 'should not require `/` after a domain name on general pattern', ->
    my_match = new UrlMatch '*://*/*'
    expect(my_match.test 'http://google.com').toBe true

  it 'should match missing 3rd level domain', ->
    my_match = new UrlMatch '*://*.aaa.com/'
    expect(my_match.test 'http://aaa.com/').toBe true
