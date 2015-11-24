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
        expect(host.sanitize '*.aaa').toEqual /^([a-z0-9-.]+\.)?aaa$/

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
