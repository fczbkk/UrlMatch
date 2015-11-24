describe 'General', ->

  url_match = null

  beforeEach ->
    url_match = new UrlMatch()

  it 'should exist', ->
    expect(UrlMatch).toBeDefined()

  describe 'add patterns', ->

    it 'should be created without a pattern', ->
      expect(url_match.patterns.length).toBe 0

    it 'should be created with single pattern', ->
      url_match = new UrlMatch '*'
      expect(url_match.patterns.length).toBe 1

    it 'should be created with multiple patterns', ->
      patterns = ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*']
      url_match = new UrlMatch patterns
      expect(url_match.patterns.length).toBe 3

    it 'should add single pattern', ->
      url_match.add '*'
      expect(url_match.patterns.length).toBe 1

    it 'should add multiple patterns', ->
      url_match.add ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*']
      expect(url_match.patterns.length).toBe 3

    it 'should only add unique patterns', ->
      url_match = new UrlMatch ['*', '*', '*']
      expect(url_match.patterns.length).toBe 1

  describe 'remove patterns', ->

    beforeEach ->
      patterns = ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*']
      url_match = new UrlMatch patterns

    it 'should remove single pattern', ->
      url_match.remove '*://aaa.bbb/*'
      expect(url_match.patterns.length).toBe 2

    it 'should remove multiple patterns', ->
      url_match.remove ['*://aaa.bbb/*', '*://ccc.ddd/*']
      expect(url_match.patterns.length).toBe 1

    it 'should ignore removing of non-existing patterns', ->
      url_match.remove '*://ggg.hhh/*'
      expect(url_match.patterns.length).toBe 3

  describe 'matching', ->

    it 'should match URL against a pattern', ->
      patterns = [
        '*'
        '*://*/*?*#*'
        'http://*/*?*#*'
        '*://aaa.bbb.ccc/*?*#*'
        '*://*/ddd/eee?*#*'
        '*://*/*?fff=ggg&hhh=iii#*'
        '*://*/*?*#jjj'
        complex_url
      ]
      for pattern in patterns
        url_match = new UrlMatch pattern
        expect(url_match.test complex_url).toBe true

    it 'should match URL against all of multiple patterns', ->
      patterns = ['*://aaa.bbb/*', '*://ccc.ddd/*', '*://eee.fff/*']
      url_match = new UrlMatch patterns
      expect(url_match.test 'http://aaa.bbb/ccc').toBe true
      expect(url_match.test 'http://xxx.yyy/zzz').toBe false
