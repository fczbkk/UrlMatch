describe 'Scheme', ->

  scheme = null

  beforeEach ->
    scheme = new Scheme()

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
