describe 'URL Match', ->

  it 'should exist', ->
    expect(UrlMatch).toBeDefined()

  it 'should accept single pattern', ->
    a = new UrlMatch()
    a.addPattern '*'
    expect(a._patterns.length).toBe 1
    b = new UrlMatch '*'
    expect(b._patterns.length).toBe 1
    
  it 'should accept array of patterns', ->
    a = new UrlMatch()
    a.addPattern ['*', '*', '*']
    expect(a._patterns.length).toBe 3
    b = new UrlMatch ['*', '*', '*']
    expect(b._patterns.length).toBe 3

  it 'should remove pattern', ->
    a = new UrlMatch ['*', '*', '*']
    a.removePattern '*'
    expect(a._patterns.length).toBe 0

  it 'should match URL against multiple patterns', ->
    # TODO

describe 'Pattern', ->
  it 'should validate', ->
  it 'should not validate if scheme, host or path is missing', ->
  it 'should not validate if scheme operator is incorrect', ->
  it 'should sanitize', ->
  it 'should split pattern into scheme, host and path parts', ->
  it 'should convert <all_urls> into *://*/*', ->
  it 'should convert * into *://*/*', ->
  it 'should match any URL when *://*/* is used', ->
  it 'should match correctly when specific URL is used', ->

describe 'Scheme', ->

  scheme = null
  
  beforeEach ->
    scheme = (new UrlMatch '*')._patterns[0].scheme
  
  it 'should validate asterisk', ->
    expect(scheme.validate '*').toBe true

  it 'should not validate more than one asterisk', ->
    expect(scheme.validate '*').toBe true
    expect(scheme.validate '**').toBe false
    expect(scheme.validate '*aaa*').toBe false
    expect(scheme.validate 'aaa**bbb').toBe false
    expect(scheme.validate 'aaa*bbb*').toBe false
    expect(scheme.validate 'aaa*bbb*ccc').toBe false

  it 'should not validate string of characters', ->
    expect(scheme.validate 'aaa').toBe true
    expect(scheme.validate 'http').toBe true
    expect(scheme.validate 'https').toBe true
    
  it 'should not validate numbers', ->
    expect(scheme.validate '123').toBe false
    expect(scheme.validate 'aaa123').toBe false
    expect(scheme.validate '123bbb').toBe false
    expect(scheme.validate 'aaa123bbb').toBe false

  it 'should not validate special characters', ->
    expect(scheme.validate 'aaa-').toBe false
    expect(scheme.validate '-bbb').toBe false
    expect(scheme.validate 'aaa-bbb').toBe false
    expect(scheme.validate '?').toBe false
    expect(scheme.validate '!').toBe false
  
  it 'should sanitize', ->
    expect(scheme.sanitize '*').toBe 'https?'
    expect(scheme.sanitize 'http').toBe 'http'
    expect(scheme.sanitize 'https').toBe 'https'
    expect(scheme.sanitize 'aaa').toBe 'aaa'
    
  it 'should match only http and https schemes when * is used', ->
    expect(scheme.test 'http', scheme.sanitize '*').toBe true
    expect(scheme.test 'https', scheme.sanitize '*').toBe true
    expect(scheme.test 'aaa', scheme.sanitize '*').toBe false
    
  it 'should match only specific scheme when provided', ->
    expect(scheme.test 'aaa', 'aaa').toBe true
    expect(scheme.test 'aaa', 'bbb').toBe false

describe 'Host', ->

  host = null
  
  beforeEach ->
    host = (new UrlMatch '*')._patterns[0].host
  
  it 'should validate asterisk', ->
    expect(host.validate '*').toBe true

  it 'should not validate multiple asterisks', ->
    expect(host.validate '**').toBe false
    expect(host.validate '**.aaa').toBe false
    expect(host.validate '**.aaa.bbb').toBe false

  it 'should validate domains', ->
    expect(host.validate 'aaa.bbb').toBe true

  it 'should validate subdomains', ->
    expect(host.validate 'aaa.bbb.ccc').toBe true
    expect(host.validate 'aaa.bbb.ccc.ddd').toBe true

  it 'should validate asterisk at the beginning of domain', ->
    expect(host.validate '*.aaa').toBe true
    expect(host.validate '*.aaa.bbb').toBe true

  it 'should not validate if asterisk is not followed by a dot', ->
    expect(host.validate '*aaa').toBe false
    expect(host.validate '*aaa.bbb').toBe false

  it 'should not validate if asterisk is not at the beginning', ->
    expect(host.validate 'aaa*').toBe false
    expect(host.validate 'aaa*bbb').toBe false
  
  it 'should not validate characters except letters, numbers and hyphen', ->
    expect(host.validate 'aaa?bbb.ccc').toBe false
    expect(host.validate 'aaa_bbb.ccc').toBe false
    expect(host.validate 'aaa+bbb.ccc').toBe false

  it 'should not validate when starts or ends with dot or hyphen', ->
    expect(host.validate '-aaa.bbb').toBe false
    expect(host.validate '.aaa.bbb').toBe false
    expect(host.validate 'aaa.bbb-').toBe false
    expect(host.validate 'aaa.bbb.').toBe false

  it 'should sanitize', ->
    expect(host.sanitize '*').toBe '[a-z0-9-.]+'
    expect(host.sanitize '*.aaa').toBe '[a-z0-9-.]+\.aaa'
    expect(host.sanitize 'aaa.bbb').toBe 'aaa\.bbb'

  it 'should match any host when * is used', ->
    expect(host.test 'aaa', host.sanitize '*').toBe true
    expect(host.test 'aaa.bbb', host.sanitize '*').toBe true
    expect(host.test 'aaa.bbb.ccc', host.sanitize '*').toBe true

  it 'should match correct hosts when *.hostname is used', ->
    expect(host.test 'aaa.bbb', host.sanitize '*.bbb').toBe true
    expect(host.test 'aaa.bbb.ccc', host.sanitize '*.ccc').toBe true
    expect(host.test 'aaa.bbb.ccc', host.sanitize '*.bbb.ccc').toBe true
    expect(host.test 'aaa.bbb', host.sanitize '*.xxx').toBe false
    expect(host.test 'aaa.bbb.ccc', host.sanitize '*.xxx').toBe false
    expect(host.test 'aaa.bbb.ccc', host.sanitize '*.bbb.xxx').toBe false

  it 'should match correct hosts when specific hostname is used', ->
    expect(host.test 'aaa', host.sanitize 'aaa').toBe true
    expect(host.test 'aaa.bbb', host.sanitize 'aaa.bbb').toBe true
    expect(host.test 'aaa.bbb.ccc', host.sanitize 'aaa.bbb.ccc').toBe true
    expect(host.test 'aaa', host.sanitize 'xxx').toBe false
    expect(host.test 'aaa.bbb', host.sanitize 'xxx.bbb').toBe false
    expect(host.test 'aaa.bbb', host.sanitize 'aaa.xxx').toBe false
    expect(host.test 'aaa.bbb.ccc', host.sanitize 'xxx.bbb.ccc').toBe false
    expect(host.test 'aaa.bbb.ccc', host.sanitize 'aaa.xxx.ccc').toBe false
    expect(host.test 'aaa.bbb.ccc', host.sanitize 'aaa.bbb.xxx').toBe false

describe 'Path', ->

  path = null
  
  beforeEach ->
    path = (new UrlMatch '*')._patterns[0].path
  
  it 'should validate only if starts with a slash', ->
    expect(path.validate '/').toBe true
    expect(path.validate '/*').toBe true
    expect(path.validate '/aaa').toBe true

  it 'should not validate if does not start with slash', ->
    expect(path.validate '').toBe false
    expect(path.validate '*').toBe false
    expect(path.validate 'aaa').toBe false

  it 'should validate asterisk', ->
    expect(path.validate '/*').toBe true
    expect(path.validate '/aaa*').toBe true
    expect(path.validate '/*aaa').toBe true
    expect(path.validate '/aaa*bbb').toBe true

  it 'should sanitize', ->
    expect(path.sanitize '/').toBe '/'
    expect(path.sanitize '/*').toBe '/[a-z0-9-./]*'
    expect(path.sanitize '/*aaa').toBe '/[a-z0-9-./]*aaa'
    expect(path.sanitize '/aaa/bbb.ccc').toBe '/aaa/bbb.ccc'

  it 'should match any path when /* is used', ->
    expect(path.test '/', path.sanitize '/*').toBe true
    expect(path.test '/aaa', path.sanitize '/*').toBe true
    expect(path.test '/aaa/bbb', path.sanitize '/*').toBe true
    expect(path.test '/aaa/bbb.ccc', path.sanitize '/*').toBe true

  it 'should match correct paths when path with * is specified', ->
    expect(path.test '/', path.sanitize '/*').toBe true
    expect(path.test '/aaa', path.sanitize '/*').toBe true
    expect(path.test '/aaa/bbb', path.sanitize '/*').toBe true
    expect(path.test '/aaa/bbb.ccc', path.sanitize '/*').toBe true
    expect(path.test '/', path.sanitize '/aaa*').toBe false
    expect(path.test '/aaa', path.sanitize '/aaa*').toBe true
    expect(path.test '/aaa/', path.sanitize '/aaa*').toBe true
    expect(path.test '/aaa/', path.sanitize '/aaa/*').toBe true
    expect(path.test '/aaa/bbb.ccc', path.sanitize '/aaa/bbb.ccc*').toBe true
    expect(path.test '/aaa/bbb.ccc', path.sanitize '/aaa/*.ccc').toBe true
    expect(path.test '/aaa/bbb.ccc', path.sanitize '/*/*.ccc').toBe true

  it 'should assume trailing slash is present when validating', ->
    expect(path.test '', path.sanitize '/*').toBe false
    expect(path.test '/aaa', path.sanitize '/aaa/*').toBe true
    expect(path.test '/aaa/bbb', path.sanitize '/aaa/bbb/*').toBe true

  it 'should match correct paths specific when path is specified', ->
    expect(path.test '/', path.sanitize '/').toBe true
    expect(path.test '/aaa', path.sanitize '/aaa').toBe true
    expect(path.test '/aaa/bbb', path.sanitize '/aaa/bbb').toBe true
    expect(path.test '/aaa/bbb.ccc', path.sanitize '/aaa/bbb.ccc').toBe true
