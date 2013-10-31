describe 'URL Match', ->
  it 'should accept single pattern', ->
  it 'should accept array of patterns', ->
  it 'should add pattern', ->
  it 'should remove pattern', ->
  it 'should match URL against multiple patterns', ->

describe 'Pattern', ->
  it 'should validate', ->
  it 'should not validate if scheme, host or path is missing', ->
  it 'should not validate if scheme operator is incorrect', ->
  it 'should sanitize', ->
  it 'should split pattern into scheme, host and path parts', ->
  it 'should match any URL when <all_urls> is used', ->
  it 'should match any URL when * is used', ->
  it 'should match any URL when *://*/* is used', ->
  it 'should match correctly when specific URL is used', ->

describe 'Scheme', ->
  it 'should validate', ->
  it 'should sanitize', ->
  it 'should match only http and https schemes when * is used', ->
  it 'should match only specific scheme when provided', ->

describe 'Host', ->
  it 'should validate', ->
  it 'should not validate if * is not followed by . or /', ->
  it 'should not validate if * is not at the beginning', ->
  it 'should sanitize', ->
  it 'should match any host when * is used', ->
  it 'should match correct hosts when *.hostname is used', ->
  it 'should match correct hosts when specific hostname is used', ->

describe 'Path', ->
  it 'should validate', ->
  it 'should sanitize', ->
  it 'should match any path when * is used', ->
  it 'should match correct paths when path with * is specified', ->
  it 'should match correct paths specific when path is specified', ->
