describe 'Fragment', ->

  fragment = null

  beforeEach ->
    fragment = new Fragment()

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
