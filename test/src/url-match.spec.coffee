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

  it 'should not add pattern if scheme operator is incorrect', ->
    a = new UrlMatch [
      'http:aaa.bbb/ccc'
      'http:/aaa.bbb/ccc'
      'http/aaa.bbb/ccc'
      'http//aaa.bbb/ccc'
    ]
    expect(a._patterns.length).toBe 0

  it 'should match URL against a general pattern', ->
    a = new UrlMatch '*'
    expect(a.test 'http://aaa.bbb/ccc').toBe true
    expect(a.test 'https://aaa.bbb/ccc').toBe true

  it 'should match correct scheme', ->
    a = new UrlMatch 'http://*/*'
    expect(a.test 'http://aaa.bbb/').toBe true
    expect(a.test 'https://aaa.bbb/').toBe false

  it 'should match correct host', ->
    a = new UrlMatch '*://aaa.bbb/*'
    b = new UrlMatch '*://*.bbb/*'
    expect(a.test 'http://aaa.bbb/').toBe true
    expect(a.test 'http://xxx.yyy/').toBe false
    expect(b.test 'http://aaa.bbb/').toBe true
    expect(b.test 'http://xxx.yyy/').toBe false

  it 'should match correct path', ->
    a = new UrlMatch '*://*/ccc/*'
    expect(a.test 'http://aaa.bbb/ccc').toBe true
    expect(a.test 'http://aaa.bbb/ccc/').toBe true
    expect(a.test 'http://aaa.bbb/ccc/ddd').toBe true
    expect(a.test 'http://aaa.bbb/ddd').toBe false
    expect(a.test 'http://aaa.bbb/ddd/').toBe false
    expect(a.test 'http://aaa.bbb/ddd/ccc').toBe false

  it 'should match URL against multiple patterns', ->
    a = new UrlMatch ['*://aaa.bbb/*', '*://ccc.ddd/*']
    expect(a.test 'http://aaa.bbb/ccc').toBe true
    expect(a.test 'http://ccc.ddd/').toBe true
    expect(a.test 'http://ccc.ddd/eee.fff').toBe true
    expect(a.test 'http://xxx.yyy/').toBe false
    

describe 'Pattern', ->

  pattern = null
  
  beforeEach ->
    pattern = (new UrlMatch '*')._patterns[0]
  
  it 'should validate', ->
    expect(pattern.validate()).toBe true
    data = pattern.getParts {scheme: '*', host: '*', path: '/*'}
    expect(pattern.validate data).toBe true
    
  it 'should not validate if scheme is missing', ->
    data = pattern.getParts {scheme: '', host: '*', path: '/*'}
    expect(pattern.validate data).toBe false

  it 'should not validate if host is missing', ->
    data = pattern.getParts {scheme: '*', host: '', path: '/*'}
    expect(pattern.validate data).toBe false

  it 'should not validate if path is missing', ->
    data = pattern.getParts {scheme: '*', host: '*', path: ''}
    expect(pattern.validate data).toBe false

  it 'should convert <all_urls> into *://*/*', ->
    expect(pattern.sanitize '<all_urls>').toBe '*://*/*'

  it 'should convert * into *://*/*', ->
    expect(pattern.sanitize '*').toBe '*://*/*'

  it 'should sanitize', ->
    expect(pattern.sanitize '*://*/*').toBe '*://*/*'
    expect(pattern.sanitize 'aaa://*/*').toBe 'aaa://*/*'
    expect(pattern.sanitize 'aaa://bbb/*').toBe 'aaa://bbb/*'
    expect(pattern.sanitize '*://bbb/*').toBe '*://bbb/*'
    expect(pattern.sanitize 'aaa://bbb/ccc').toBe 'aaa://bbb/ccc'
    expect(pattern.sanitize '*://bbb/ccc').toBe '*://bbb/ccc'
    expect(pattern.sanitize 'aaa://*/ccc').toBe 'aaa://*/ccc'
    expect(pattern.sanitize '*://*/ccc').toBe '*://*/ccc'

  it 'should split valid pattern into parts', ->
    result = pattern.split '*://*/*'
    expect(result.scheme).toBe '*'
    expect(result.host).toBe '*'
    expect(result.path).toBe '/*'
    result = pattern.split 'aaa://bbb.ccc/ddd'
    expect(result.scheme).toBe 'aaa'
    expect(result.host).toBe 'bbb.ccc'
    expect(result.path).toBe '/ddd'
  
  it 'should split invalid valid pattern into empty parts', ->
    result = pattern.split ''
    expect(result.scheme).toBe ''
    expect(result.host).toBe ''
    expect(result.path).toBe ''
    result = pattern.split 'xxx'
    expect(result.scheme).toBe ''
    expect(result.host).toBe ''
    expect(result.path).toBe ''
  
  it 'should match any URL when *://*/* is used', ->
    pattern = (new UrlMatch '*')._patterns[0]
    expect(pattern.test 'http://aaa.bbb/').toBe true
    expect(pattern.test 'http://aaa.bbb/ccc').toBe true
    expect(pattern.test 'http://aaa.bbb/ccc.ddd').toBe true
    expect(pattern.test 'http://aaa.bbb/ccc/ddd').toBe true
    expect(pattern.test 'http://aaa.bbb/ccc/ddd.eee').toBe true
    
  it 'should match correctly when specific URL is used', ->
    pattern = (new UrlMatch 'http://aaa.bbb/*')._patterns[0]
    expect(pattern.test 'http://aaa.bbb/').toBe true
    expect(pattern.test 'https://aaa.bbb/').toBe false
    expect(pattern.test 'http://xxx.yyy/').toBe false
    expect(pattern.test 'http://aaa.bbb/ccc').toBe true
    expect(pattern.test 'http://aaa.bbb/ccc.ddd').toBe true
    expect(pattern.test 'http://aaa.bbb/ccc/ddd').toBe true
    expect(pattern.test 'http://aaa.bbb/ccc/ddd.eee').toBe true

  it 'should not match non-matching URLs', ->
    pattern = (new UrlMatch '*://xxx.yyy/*')._patterns[0]
    expect(pattern.test 'http://aaa.bbb/').toBe false
    expect(pattern.test 'http://aaa.bbb/ccc').toBe false
    expect(pattern.test 'http://aaa.bbb/ccc.ddd').toBe false
    expect(pattern.test 'http://aaa.bbb/ccc/ddd').toBe false
    expect(pattern.test 'http://aaa.bbb/ccc/ddd.eee').toBe false

  it 'should not match invalid URLs', ->
    pattern = (new UrlMatch '*')._patterns[0]
    expect(pattern.test 'http://').toBe false
    expect(pattern.test 'http:aaa.bbb/').toBe false
    expect(pattern.test 'aaa.bbb').toBe false

describe 'Scheme', ->

  scheme = null
  
  beforeEach ->
    scheme = (new UrlMatch '*')._patterns[0].parts.scheme
  
  it 'should create correct pattern', ->
    scheme = (new UrlMatch '*')._patterns[0].parts.scheme
    expect(scheme.pattern).toBe 'https?'
    scheme = (new UrlMatch 'http://*/*')._patterns[0].parts.scheme
    expect(scheme.pattern).toBe 'http'

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
    
  it 'should match only http/https scheme when specific scheme provided', ->
    expect(scheme.test 'http', 'http').toBe true
    expect(scheme.test 'http', 'https').toBe false
    expect(scheme.test 'https', 'https').toBe true
    expect(scheme.test 'http', 'https').toBe false

  it 'should match only specific scheme when provided', ->
    expect(scheme.test 'aaa', 'aaa').toBe true
    expect(scheme.test 'aaa', 'aaaaaa').toBe false
    expect(scheme.test 'aaa', 'bbb').toBe false

describe 'Host', ->

  host = null
  
  beforeEach ->
    host = (new UrlMatch '*')._patterns[0].parts.host
  
  it 'should not validate if empty', ->
    expect(host.validate '').toBe false

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
    path = (new UrlMatch '*')._patterns[0].parts.path
  
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
