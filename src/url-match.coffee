# URL Matcher in the style of Google Chrome:
# http://developer.chrome.com/extensions/match_patterns.html

class UrlMatch
  
  constructor: (pattern) ->
    @_patterns = []
    @addPattern pattern
  
  addPattern: (pattern) ->
    (@addPattern item for item in pattern) if isArray pattern
    if typeof pattern is 'string'
      patternObj = new Pattern pattern
      @_patterns.push patternObj if patternObj.validate()
  
  removePattern: (pattern) ->
    @_patterns = @_patterns.filter (item) -> item.originalPattern isnt pattern
  
  test: (url = '') ->
    # Go through all patterns and return false if any of them does not match.
    (return false if not pattern.validate url) for pattern in @_patterns
    # None of the patterns returned false, it means that URL passed them all.
    true

# Expose object to the global namespace
window.UrlMatch = UrlMatch

# # Helper classes

class Pattern

  # RegEx to validate and split the URL pattern
  _RE: ///
    ^                     # beginning
    ([a-z]+|\*)           # (1) scheme
    ://                   # scheme separator
    (.+@)*                # (2) username and/or password
    ([\w\*\.\-]+(\:\d+)*) # (3) host, including (4) port number
    (/[^\?\#]*)           # (5) path
  ///

  constructor: (@originalPattern = '') ->
    @parts = @getParts @split @sanitize @originalPattern
  
  split: (pattern = @sanitize @originalPattern) ->
    result =
      scheme: ''
      host: ''
      path: ''
    if @_RE.test pattern
      parts = pattern.match @_RE
      result.scheme = parts?[1]
      result.host = parts?[3]
      result.path = parts?[5]
    result
  
  getParts: (fragments = (@split @sanitize @originalPattern) or {}) ->
    scheme: new Scheme fragments.scheme
    host: new Host fragments.host
    path: new Path fragments.path
  
  sanitize: (pattern = @originalPattern) ->
    # Convert general patterns into a well formed one.
    pattern = '*://*/*' if pattern in ['<all_urls>', '*']
    pattern

  validate: (parts = @parts) ->
    parts.scheme?.validate() and
    parts.host?.validate() and
    parts.path?.validate()
    
  test: (url = '', parts = @parts)->
    if fragments = @split url
      parts.scheme?.test(fragments.scheme) and
      parts.host?.test(fragments.host) and
      parts.path?.test(fragments.path)
    else
      false

class UrlFragment

  _sanitation: {}
  _validationRequire: []
  _validationReject: []

  constructor: (@originalPattern) ->
    @pattern = @sanitize @originalPattern

  validate: (pattern = @originalPattern) ->
    result = false
    for rule in @_validationRequire
      result = true if rule.test pattern
    for rule in @_validationReject
      result = false if rule.test pattern
    result

  sanitize: (pattern = @originalPattern) ->
    pattern = pattern.replace val, key for key, val of @_sanitation
    pattern

  test: (part, pattern = @pattern) ->
    ///#{pattern}///.test part

class Scheme extends UrlFragment
  _validationRequire: [
    /^([a-z]+|\*)$/ # only characters or single asterisk
  ]
  _sanitation:
    'https?': '*'

class Host extends UrlFragment
  _validationRequire: [
    /.+/            # should not be empty
  ]
  _validationReject: [
    /\*\*/          # two asterisks in a row
    /\*[^\.]+/      # asterisk not followed by a dot
    /.\*/           # asterisk not at the beginning
    /^(\.|-)/       # starts with dot or hyphen
    /(\.|-)$/       # ends with dot or hyphen
    /[^a-z0-9-.\*]/ # anything except characters, numbers, hyphen, dot and *
  ]
  _sanitation:
    '[a-z0-9-.]+': '*'

class Path extends UrlFragment
  _validationRequire: [
    /^\//   # must start with a slash
  ]
  _sanitation:
    # Assume trailing slash at the end of path as optional, but not if it is
    # the first one.
    '(/*|$)': /(?!^)\/\*$/
      # Allow letters, numbers, hyphens and dots and slashes instead of *.
    '[a-z0-9-./]*': /\*/g
    
# # Utilities

# Check if object is an array. Used when adding patterns to UrlMatch.
# Taken from:
# http://coffeescriptcookbook.com/chapters/arrays/check-type-is-array
isArray = (value) ->
  value and
  typeof value is 'object' and
  value instanceof Array and
  typeof value.length is 'number' and
  typeof value.splice is 'function' and
  not (value.propertyIsEnumerable 'length')
