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
