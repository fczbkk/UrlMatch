describe 'Path', ->

  path = null

  beforeEach ->
    path = new Path()

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
