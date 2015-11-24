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
