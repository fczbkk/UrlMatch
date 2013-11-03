# URL Matcher in the style of Google Chrome:
# http://developer.chrome.com/extensions/match_patterns.html

class UrlMatch
  
  constructor: (pattern) ->
    @_patterns = []
    @addPattern pattern
  
  # Adds a pattern (or group of patterns) to the list.
  # The *pattern* parameter can be either string (single pattern) or array
  # (group of patterns).
  addPattern: (pattern) ->
    (@addPattern item for item in pattern) if isArray pattern
    if typeof pattern is 'string'
      patternObj = new Pattern pattern
      @_patterns.push patternObj if patternObj.validate()
  
  # Remove a pattern (or group of patterns) from the list.
  # The *pattern* parameter can be either string (single pattern) or array
  # (group of patterns).
  removePattern: (pattern) ->
    (@removePattern item for item in pattern) if isArray pattern
    if typeof pattern is 'string'
      @_patterns = @_patterns.filter (item) ->
        item.originalPattern isnt pattern
  
  # Test if *url* (string) matches any of the patterns.
  test: (url = '') ->
    # Go through all patterns and return true if any of them does match.
    (return true if pattern.test url) for pattern in @_patterns
    # If none of the patterns matched, return false.
    false

# Expose object to the global namespace
window.UrlMatch = UrlMatch

# # Helper classes

# Contains a single pattern and provides methods to sanitize, validate and
# test URLs against it.
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
  
  # Splits the pattern into object with three properties: scheme, host and
  # path. If the pattern is not valid, it returns empty strings for all of the
  # properties. This usually means that all tests for any values will fail.
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
  
  # Each of the parts has it's own validation and sanitation rules. It is
  # easier to treat them as separate objects.
  getParts: (fragments = (@split @sanitize @originalPattern) or {}) ->
    scheme: new Scheme fragments.scheme
    host: new Host fragments.host
    path: new Path fragments.path
  
  # User can use shortcuts for commonly used patterns, such as single asterisk.
  sanitize: (pattern = @originalPattern) ->
    # Convert general patterns into a well formed one.
    pattern = '*://*/*' if pattern in ['<all_urls>', '*']
    pattern
  
  # The Pattern is valid if all of its parts are valid.
  validate: (parts = @parts) ->
    parts.scheme?.validate() and
    parts.host?.validate() and
    parts.path?.validate()
  
  # When testing against a URL, it is first divided into parts and then tested
  # agains each of the part separately.
  test: (url = '', parts = @parts)->
    if fragments = @split url
      parts.scheme?.test(fragments.scheme) and
      parts.host?.test(fragments.host) and
      parts.path?.test(fragments.path)
    else
      false

# This is an abstract objects that all of the specialized objects for parts
# (Scheme, Host and Path) inherit from. It provides methods to validate,
# sanitize and test patterns against provided rules. Each of the child objects
# has the same interface and functionality, it just provides a different set
# of rules.
class UrlFragment

  # List of sanitation rules in form of a hash object. The key is a string to
  # be used as a replacement, the value is a string or regex to be replaced.
  # This order is somehow counterintuitive, but I used it because regex can
  # not be used as a key and I didn't want to use more complex structure.
  _sanitation: {}
  
  # Arrays containing validation rules. They can contain mix of strings and/or
  # regexes.
  _validationRequire: []
  _validationReject: []
  
  _patternBefore: '^'
  _patternAfter: '$'

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
    ///
      #{@_patternBefore}
      #{pattern}
      #{@_patternAfter}
    ///.test part

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
