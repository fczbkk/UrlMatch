describe 'URL Match', ->

  url_match = null
  complex_url = 'http://user:pass@aaa.bbb.ccc:8080/ddd/eee?fff=ggg&hhh=iii#jjj'

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

  describe 'Pattern', ->

    pattern = null

    beforeEach ->
      pattern = new UrlMatch.Pattern()

    describe 'split', ->

      it 'should use null for missing parts', ->
        result = pattern.split '*://*/*'
        expect(result.params).toEqual null
        expect(result.fragment).toEqual null

      it 'should use custom value for missing parts', ->
        result = pattern.split '*://*/*', '*'
        expect(result.params).toEqual '*'
        expect(result.fragment).toEqual '*'

      it 'should split into correct parts', ->
        result = pattern.split '*://*/*?*#*'
        expect(result.scheme).toEqual '*'
        expect(result.host).toEqual '*'
        expect(result.path).toEqual '*'
        expect(result.params).toEqual '*'
        expect(result.fragment).toEqual '*'

      it 'should split pattern into correct parts', ->
        result = pattern.split complex_url
        expect(result.scheme).toEqual 'http'
        expect(result.host).toEqual 'aaa.bbb.ccc'
        expect(result.path).toEqual 'ddd/eee'
        expect(result.params).toEqual 'fff=ggg&hhh=iii'
        expect(result.fragment).toEqual 'jjj'

    describe 'getUrlParts', ->

      url_parts = null

      beforeEach ->
        url_parts = pattern.getUrlParts '*://*/*?*#*'

      for part in ['Scheme', 'Host', 'Path', 'Params', 'Fragment']
        it "should get correct #{part}", ->
          obj = new UrlMatch[part] '*'
          url_parts_re = url_parts[part.toLowerCase()].pattern.toString()
          obj_re = obj.pattern.toString()
          expect(url_parts_re).toEqual obj_re

    describe 'validate', ->

      validatePattern = (content = '', expected_value = true) ->
        url_parts = pattern.getUrlParts content
        expect(pattern.validate url_parts).toBe expected_value

      describe 'valid patterns', ->

        it 'should validate universal pattern', ->
          validatePattern '*://*/*?*#*', true

        it 'should validate pattern with empty path', ->
          validatePattern '*://*/', true

        it 'should validate pattern with just scheme, host and path', ->
          validatePattern '*://*/*', true
          validatePattern 'http://aaa.bbb/ccc', true

        it 'should validate pattern with params', ->
          validatePattern '*://*/*?aaa=bbb', true

        it 'should validate pattern with fragment', ->
          validatePattern '*://*/*#aaa', true

        it 'should validate full pattern', ->
          validatePattern '*://*/*?*#*', true
          validatePattern complex_url, true

      describe 'incomplete patterns', ->

        it 'should not validate pattern without scheme', ->
          validatePattern '*/*', false
          validatePattern '://*/*', false
          validatePattern '://aaa.bbb/', false
          validatePattern 'aaa.bbb/', false

        it 'should not validate pattern without host', ->
          validatePattern '*:///*', false
          validatePattern 'http:///aaa', false

      describe 'invalid patterns', ->
        it 'should not validate pattern with invalid scheme', ->
          validatePattern 'http//*/*', false
          validatePattern 'http:/*/*', false
          validatePattern 'http:*/*', false
          validatePattern 'http*/*', false

        it 'should not validate pattern with invalid host', ->
          validatePattern 'http://**/*', false
          validatePattern 'http://aaa*bbb/*', false
          validatePattern 'http://aaa.*/*', false

        it 'should not validate pattern with invalid params', ->
          validatePattern '*://*/*?aaa==bbb', false
          validatePattern '*://*/*?aaa=bbb=ccc', false
          validatePattern '*://*/*?=', false

        it 'should not validate pattern with invalid fragment', ->
          validatePattern '*://*/*##', false
          validatePattern '*://*/*##aaa', false
          validatePattern '*://*/*#aaa#', false
          validatePattern '*://*/*#aaa#bbb', false

    describe 'sanitize', ->

      it 'should convert single asterisk to universal match pattern', ->
        pattern = new UrlMatch.Pattern '*'
        expect(pattern.original_pattern).toEqual '*://*/*?*#*'

      it 'should convert `<all_urls>` to universal match pattern', ->
        pattern = new UrlMatch.Pattern '<all_urls>'
        expect(pattern.original_pattern).toEqual '*://*/*?*#*'

    describe 'match', ->

      it 'should match any URL', ->
        pattern = new UrlMatch.Pattern '*://*/*?*#*'
        expect(pattern.test complex_url).toBe true

      it 'should match correct scheme', ->
        pattern = new UrlMatch.Pattern 'http://*/*?*#*'
        expect(pattern.test complex_url).toBe true

      it 'should match correct host', ->
        pattern = new UrlMatch.Pattern '*://aaa.bbb.ccc/*?*#*'
        expect(pattern.test complex_url).toBe true

      it 'should match correct path', ->
        pattern = new UrlMatch.Pattern '*://*/ddd/eee?*#*'
        expect(pattern.test complex_url).toBe true

      it 'should match correct params', ->
        pattern = new UrlMatch.Pattern '*://*/*?fff=ggg&hhh=iii#*'
        expect(pattern.test complex_url).toBe true

      it 'should match correct fragment', ->
        pattern = new UrlMatch.Pattern '*://*/*?*#jjj'
        expect(pattern.test complex_url).toBe true

      it 'should match exact URL', ->
        pattern = new UrlMatch.Pattern complex_url
        expect(pattern.test complex_url).toBe true

      it 'should match pattern without path correctly', ->
        pattern = new UrlMatch.Pattern '*://aaa.bbb/'
        expect(pattern.test 'http://aaa.bbb/').toBe true
        expect(pattern.test 'http://aaa.bbb/ccc').toBe false

  describe 'Scheme', ->

    scheme = null

    beforeEach ->
      scheme = new UrlMatch.Scheme()

    describe 'validation', ->

      it 'should not validate if empty', ->
        expect(scheme.validate()).toBe false
        expect(scheme.validate '').toBe false

      it 'should validate asterisk', ->
        expect(scheme.validate '*').toBe true

      it 'should not validate more than one asterisk', ->
        schemes = ['**', '*a*', '**a', 'a**', 'a**b', '*a*b', 'a*b*', 'a*b*c']
        for pattern in schemes
          expect(scheme.validate pattern).toBe false

      it 'should validate string of characters', ->
        schemes = ['aaa', 'http', 'https']
        for pattern in schemes
          expect(scheme.validate pattern).toBe true

      it 'should not validate numbers', ->
        schemes = ['123', 'aaa123', '123bbb', 'aaa123bbb']
        for pattern in schemes
          expect(scheme.validate pattern).toBe false

      it 'should not validate special characters', ->
        schemes = ['-', '?', '!', 'aaa-', '-aaa', 'aaa-bbb']
        for pattern in schemes
          expect(scheme.validate pattern).toBe false

    describe 'sanitize', ->

      it 'should sanitize *', ->
        expect(scheme.sanitize '*').toEqual /^https?$/

      it 'should sanitize custom protocol', ->
        expect(scheme.sanitize 'http').toEqual /^http$/
        expect(scheme.sanitize 'https').toEqual /^https$/

    describe 'test', ->

      it 'should match only specific scheme when provided', ->
        invalid_pairs =
          'aaa': 'aaaaaa'
          'aaa': 'aaabbb'
          'aaa': 'bbbaaa'
          'aaa': 'bbb'
        for key, val of invalid_pairs
          pattern = scheme.sanitize val
          expect(scheme.test key, pattern).toBe false

      it 'should only match `http` or `https` on universal pattern', ->
        pattern = scheme.sanitize '*'
        expect(scheme.test 'http', pattern).toBe true
        expect(scheme.test 'https', pattern).toBe true
        expect(scheme.test 'aaa', pattern).toBe false

  describe 'Host', ->

    host = null

    beforeEach ->
      host = new UrlMatch.Host()

    describe 'validate', ->

      it 'should not validate if empty', ->
        expect(host.validate()).toBe false
        expect(host.validate '').toBe false

      it 'should validate asterisk', ->
        expect(host.validate '*').toBe true

      it 'should not validate multiple asterisks', ->
        hosts = ['**', '**.aaa', '**.aaa.bbb']
        for pattern in hosts
          expect(host.validate pattern).toBe false

      it 'should validate domain without subdomain', ->
        hosts = ['aaa.bbb']
        for pattern in hosts
          expect(host.validate pattern).toBe true

      it 'should validate domain with any level of subdomains', ->
        hosts = ['aaa.bbb.ccc', 'aaa.bbb.ccc.ddd']
        for pattern in hosts
          expect(host.validate pattern).toBe true

      it 'should validate asterisk at the beginning of domain', ->
        hosts = ['*.aaa', '*.aaa.bbb']
        for pattern in hosts
          expect(host.validate pattern).toBe true

      it 'should not validate if asterisk is not followed by a dot', ->
        hosts = ['*aaa', '*aaa.bbb']
        for pattern in hosts
          expect(host.validate pattern).toBe false

      it 'should not validate if asterisk is not at the beginning', ->
        hosts = ['aaa*', 'aaa*bbb']
        for pattern in hosts
          expect(host.validate pattern).toBe false

      it 'should not validate characters except letters, numbers and -', ->
        hosts = ['aaa?bbb.ccc', 'aaa_bbb.ccc', 'aaa+bbb.ccc']
        for pattern in hosts
          expect(host.validate pattern).toBe false

      it 'should not validate when starts or ends with dot or hyphen', ->
        hosts = ['-aaa.bbb', '.aaa.bbb', 'aaa.bbb-', 'aaa.bbb.']
        for pattern in hosts
          expect(host.validate pattern).toBe false

    describe 'sanitize', ->

      it 'should sanitize *', ->
        expect(host.sanitize '*').toEqual /^[a-z0-9-.]+$/

      it 'should sanitize host without asterisk', ->
        expect(host.sanitize 'aaa').toEqual /^aaa$/

      it 'should sanitize host with asterisk', ->
        expect(host.sanitize '*.aaa').toEqual /^[a-z0-9-.]+\.aaa$/

    describe 'match', ->

      it 'should match any host when * is used', ->
        pattern = host.sanitize '*'
        hosts = ['aaa', 'aaa.bbb', 'aaa.bbb.ccc']
        for item in hosts
          expect(host.test item, pattern).toBe true

      it 'should match correct hosts when *.hostname is used', ->
        pairs =
          'aaa.bbb': '*.bbb'
          'aaa.bbb.ccc': '*.ccc'
          'aaa.bbb.ccc': '*.bbb.ccc'
        for key, val of pairs
          pattern = host.sanitize val
          expect(host.test key, pattern).toBe true

      it 'should not match incorrect hosts when *.hostname is used', ->
        pairs =
          'aaa.bbb': '*.xxx'
          'aaa.bbb.ccc': '*.xxx'
          'aaa.bbb.ccc': '*.bbb.xxx'
        for key, val of pairs
          pattern = host.sanitize val
          expect(host.test key, pattern).toBe false

      it 'should match correct hosts when specific hostname is used', ->
        hosts = ['aaa', 'aaa.bbb', 'aaa.bbb.ccc']
        for item in hosts
          pattern = host.sanitize item
          expect(host.test item, pattern).toBe true

      it 'should not match incorrect hosts when specific hostname is used', ->
        pairs =
          'aaa': 'xxx'
          'aaa.bbb': 'xxx.bbb'
          'aaa.bbb': 'aaa.xxx'
          'aaa.bbb.ccc': 'xxx.bbb.ccc'
          'aaa.bbb.ccc': 'aaa.xxx.ccc'
          'aaa.bbb.ccc': 'aaa.bbb.xxx'
        for key, val of pairs
          pattern = host.sanitize val
          expect(host.test key, pattern).toBe false

  describe 'Path', ->

    path = null

    beforeEach ->
      path = new UrlMatch.Path()

    describe 'validate', ->

      it 'should validate asterisk', ->
        paths = [
          '*', '*/*', 'aaa*', '*aaa', 'aaa*bbb', '*/aaa', 'aaa/*', 'aaa/*/bbb'
        ]
        for pattern in paths
          expect(path.validate pattern).toBe true

      it 'should validate specific path', ->
        paths = ['aaa', 'aaa/', 'aaa/bbb', 'aaa/bbb/']
        for pattern in paths
          expect(path.validate pattern).toBe true

    describe 'sanitize', ->

      # TODO

    describe 'test', ->

      it 'should match any path when * is used', ->
        paths = ['', '/', 'aaa', 'aaa/', 'aaa/bbb', 'aaa/bbb/', 'aaa/bbb.ccc']
        pattern = path.sanitize '*'
        for item in paths
          expect(path.test item, pattern).toBe true

      it 'should match path containing uppercase letters when * is used', ->
        pattern = path.sanitize '*'
        expect(path.test 'AAA', pattern).toBe true

      it 'should match path containing underscore', ->
        pattern = path.sanitize '*'
        expect(path.test 'aaa_bbb', pattern).toBe true

      it 'should match correct paths when path with * is specified', ->
        pairs =
          'aaa': 'aaa*'
          'aaa/': 'aaa*/'
          'aaa/': 'aaa/*'
          'aaa/bbb.ccc': 'aaa/bbb.ccc*'
          'aaa/bbb.ccc': 'aaa/*.ccc'
          'aaa/bbb.ccc': '*/*.ccc'
        for key, val of pairs
          pattern = path.sanitize val
          expect(path.test key, pattern).toBe true

      it 'should not match incorrect paths when path with * is specified', ->
        pairs =
          'bbb': 'aaa*'
          'bbb/': 'aaa/*'
          'aaa/ccc': 'aaa/*.ccc'
          'bbb.ccc': '*/*.ccc'
        for key, val of pairs
          pattern = path.sanitize val
          expect(path.test key, pattern).toBe false

      it 'should assume trailing `/` is optional', ->
        pairs =
          '': '/'
          'aaa': 'aaa/'
          'aaa/bbb': 'aaa/bbb/'
        for key, val of pairs
          pattern = path.sanitize val
          expect(path.test key, pattern).toBe true

      it 'should assume trailing `/*` is present when matching', ->
        pairs =
          '': '*'
          'aaa': 'aaa/*'
          'aaa/bbb': 'aaa/bbb/*'
        for key, val of pairs
          pattern = path.sanitize val
          expect(path.test key, pattern).toBe true

      it 'should match correct paths specific when path is specified', ->
        paths = ['', 'aaa', 'aaa/bbb', 'aaa/bbb.ccc']
        for item in paths
          pattern = path.sanitize item
          expect(path.test item, pattern).toBe true

      it 'should treat missing path as empty string', ->
        pattern = path.sanitize null
        expect(path.test null, pattern).toBe true
        expect(path.test '', pattern).toBe true
        expect(path.test 'aaa', pattern).toBe false

  describe 'Params', ->

    params = null

    beforeEach ->
      params = new UrlMatch.Params()

    describe 'validate', ->

      it 'should validate asterisk', ->
        expect(params.validate '*').toBe true

      it 'should validate full pair (key and value defined)', ->
        expect(params.validate 'aaa=bbb').toBe true

      it 'should validate valueless param', ->
        patterns = ['aaa', 'aaa=bbb&ccc']
        for pattern in patterns
          expect(params.validate pattern).toBe true

      it 'should validate on multiple pairs', ->
        patterns = ['aaa=bbb&ccc=ddd', 'aaa=bbb&ccc=ddd&eee=fff']
        for pattern in patterns
          expect(params.validate pattern).toBe true

      it 'should validate on pair with asterisk instead of key or value', ->
        patterns = ['*=*', 'aaa=*', '*=aaa', 'aaa=*&*=bbb']
        for pattern in patterns
          expect(params.validate pattern).toBe true

      it 'should not validate multiple equal signs', ->
        patterns = ['==', 'aaa==bbb']
        for pattern in patterns
          expect(params.validate pattern).toBe false

      it 'should not validate pairs undivided by ampersand', ->
        patterns = ['aaa=bbb=', '=aaa=bbb', 'aaa=bbb=ccc']
        for pattern in patterns
          expect(params.validate pattern).toBe false

      it 'should not validate an asterisk sandwitch', ->
        expect(params.validate 'aaa=*=bbb').toBe false

      it 'should not validate single equal sign', ->
        expect(params.validate '=').toBe false

    describe 'sanitize', ->

      it 'should return empty hash on empty', ->
        expect(params.sanitize()).toEqual {}

      it 'should return empty hash on single asterisk', ->
        expect(params.sanitize '*').toEqual {}

      it 'should break the single pair pattern down to key/val pairs', ->
        expect(params.sanitize 'aaa=bbb').toEqual {'aaa': '=bbb'}

      it 'should break the multi pair pattern down to key/val pairs', ->
        expect(params.sanitize 'aaa=bbb&ccc=ddd').toEqual
          'aaa': '=bbb'
          'ccc': '=ddd'

      it 'should replace asterisks in keys with universal matches', ->
        expect(params.sanitize '*=bbb').toEqual {'.+': '=bbb'}

      it 'should replace asterisks in vals with universal matches', ->
        expect(params.sanitize 'aaa=*').toEqual {'aaa': '=?.*'}

      it 'should replace partial asterisks with universal matches', ->
        expect(params.sanitize 'aaa*=*bbb&ccc*ddd=*eee*').toEqual
          'aaa.*': '=.*bbb'
          'ccc.*ddd': '=.*eee.*'

      it 'should escape square brackets', ->
        expect(params.sanitize 'aaa=[]').toEqual
          'aaa': '=\\[\\]'

      it 'should escape nested square brackets', ->
        expect(params.sanitize 'aaa=[[]]').toEqual
          'aaa': '=\\[\\[\\]\\]'

      it 'should escape serialized JSON data', ->
        expect(params.sanitize 'aaa=[[]]').toEqual
          'aaa': '=\\[\\[\\]\\]'

    describe 'test', ->

      it 'should match empty params on universal match', ->
        pattern = params.sanitize '*'
        expect(params.test '', pattern).toBe true

      it 'should match any params on universal match', ->
        pattern = params.sanitize '*'
        items = ['aaa', 'aaa=bbb', 'aaa=bbb&ccc=ddd']
        for item in items
          expect(params.test item, pattern).toBe true

      it 'should match at least one param on asterisk to asterisk match', ->
        pattern = params.sanitize '*=*'
        expect(params.test '', pattern).toBe false
        expect(params.test 'aaa', pattern).toBe true
        expect(params.test 'aaa=bbb', pattern).toBe true
        expect(params.test 'aaa=bbb&ccc=ddd', pattern).toBe true

      it 'should match single key/val pair', ->
        pattern = params.sanitize 'aaa=bbb'
        valid_items = ['aaa=bbb']
        for item in valid_items
          expect(params.test item, pattern).toBe true
        invalid_items = ['aaa', 'bbb', 'bbb=aaa', 'ccc=ddd']
        for item in invalid_items
          expect(params.test item, pattern).toBe false

      it 'should match single key/val pair among many pairs', ->
        pattern = params.sanitize 'aaa=bbb'
        valid_items = ['aaa=bbb&ccc=ddd', 'ccc=ddd&aaa=bbb&eee=fff']
        for item in valid_items
          expect(params.test item, pattern).toBe true
        invalid_items = ['bbb=aaa&ccc=ddd', 'ccc=ddd&eee=fff&ggg=hhh']
        for item in invalid_items
          expect(params.test item, pattern).toBe false

      it 'should match multiple key/val pairs in any order', ->
        pattern = params.sanitize 'aaa=bbb&ccc=ddd'
        valid_items = ['ccc=ddd&aaa=bbb', 'eee=fff&aaa=bbb&ccc=ddd']
        for item in valid_items
          expect(params.test item, pattern).toBe true

      it 'should match pair with universal key', ->
        pattern = params.sanitize 'aaa=*'
        expect(params.test 'aaa=bbb', pattern).toBe true

      it 'should match pair with universal val', ->
        pattern = params.sanitize '*=bbb'
        expect(params.test 'aaa=bbb', pattern).toBe true

      it 'should match partial wildcard in key', ->
        pattern = params.sanitize 'aaa*ccc=ddd'
        expect(params.test 'aaabbbccc=ddd', pattern).toBe true

      it 'should match partial wildcard in val', ->
        pattern = params.sanitize 'aaa=bbb*ddd'
        expect(params.test 'aaa=bbbcccddd', pattern).toBe true

      it 'should match val with square brackets', ->
        pattern = params.sanitize 'aaa=[bbb]'
        expect(params.test 'aaa=[bbb]', pattern).toBe true

      it 'should match val with asterisk in square brackets', ->
        pattern = params.sanitize 'aaa=bbb[*]ddd'
        expect(params.test 'aaa=bbb[ccc]ddd', pattern).toBe true

      it 'should match val with nested brackets', ->
        pattern = params.sanitize 'aaa=[[*]]'
        expect(params.test 'aaa=[[bbb]]', pattern).toBe true

      it 'should match val with serialized JSON data', ->
        pattern = params.sanitize 'aaa={bbb:*,ddd:[*,fff]}'
        expect(params.test 'aaa={bbb:ccc,ddd:[eee,fff]}', pattern).toBe true


  describe 'Fragment', ->

    fragment = null

    beforeEach ->
      fragment = new UrlMatch.Fragment()

    describe 'validate', ->

      it 'should validate asterisk', ->
        expect(fragment.validate '*').toBe true

      it 'should not validate invalid characters', ->
        expect(fragment.validate '#').toBe false

      it 'should validate on combination of characters and asterixes', ->
        expect(fragment.validate 'aaa*bbb*ccc').toBe true

    describe 'sanitize', ->

      it 'should sanitize single asterisk', ->
        expect(fragment.sanitize '*').toEqual /^.*$/

      it 'should sanitize characters with single asterisk', ->
        expect(fragment.sanitize 'aaa*').toEqual /^aaa.*$/
        expect(fragment.sanitize '*bbb').toEqual /^.*bbb$/
        expect(fragment.sanitize 'aaa*bbb').toEqual /^aaa.*bbb$/

      it 'should sanitize characters with multiple asterisk', ->
        expect(fragment.sanitize 'aaa*bbb*ccc').toEqual /^aaa.*bbb.*ccc$/

    describe 'test', ->

      it 'should match empty fragment on universal match', ->
        pattern = fragment.sanitize '*'
        expect(fragment.test null, pattern).toBe true
        expect(fragment.test '', pattern).toBe true

      it 'should match any fragment on universal match', ->
        pattern = fragment.sanitize '*'
        expect(fragment.test 'aaa', pattern).toBe true

      it 'should match specific fragment', ->
        pattern = fragment.sanitize 'aaa'
        expect(fragment.test 'aaa', pattern).toBe true

      it 'should match fragment with single asterix', ->
        pattern = fragment.sanitize 'aaa*'
        expect(fragment.test 'aaa', pattern).toBe true
        expect(fragment.test 'aaabbb', pattern).toBe true

      it 'should not match invalid fragment with single asterix', ->
        pattern = fragment.sanitize 'aaa*'
        expect(fragment.test 'bbb', pattern).toBe false
        expect(fragment.test 'bbbaaa', pattern).toBe false

      it 'should match fragment with multiple asterixes', ->
        pattern = fragment.sanitize 'aaa*bbb*'
        expect(fragment.test 'aaabbb', pattern).toBe true
        expect(fragment.test 'aaaxxxbbbxxx', pattern).toBe true

      it 'should not match invalid fragment with multiple asterixes', ->
        pattern = fragment.sanitize 'aaa*bbb*'
        expect(fragment.test 'xxx', pattern).toBe false
        expect(fragment.test 'xxxaaa', pattern).toBe false
        expect(fragment.test 'xxxaaabbb', pattern).toBe false


# real life examples

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
