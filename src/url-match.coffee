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

  constructor: (@originalPattern) ->
    @pattern = @originalPattern
    # convert general patterns into a well formed one
    @pattern = '*://*/*' if @pattern in ['<all_urls>', '*']
    if @_RE.test @pattern
      #split URL pattern into parts and create helper objects
      @parts = @pattern.match @_RE
      @scheme = new Scheme @parts?[1]
      @host = new Host @parts?[3]
      @path = new Path @parts?[5]

  validate: ->
    @scheme?.validate() and
    @host?.validate() and
    @path?.validate()

class Scheme
  
  constructor: (@originalPattern) ->
    @pattern = @sanitize @originalPattern
  
  validate: (pattern = @originalPattern) ->
    ///
      ^            # beginning
      ([a-z]+|\*)  # characters or single asterisk
      $            # end
    ///.test pattern
  
  sanitize: (pattern = @originalPattern) ->
    pattern
      .replace('*', 'https?')
  
  test: (scheme, pattern = @pattern) ->
    ///
      ^
      #{pattern}
      $
    ///.test scheme

class Host

  constructor: (@originalPattern) ->
    @pattern = @sanitize @originalPattern

  sanitize: (pattern = @originalPattern) ->
    pattern
      # Allow letters, numbers, hyphens and dots instead of asterisk.
      .replace('*', '[a-z0-9-.]+')

  validate: (pattern = @originalPattern) ->
    # list of prohibited sequences in pattern
    not ///
      \*\*           # two asterisks in a row
      |\*[^\.]+      # asterisk not followed by a dot
      |.\*           # asterisk not at the beginning
      |^(\.|-)       # starts with dot or hyphen
      |(\.|-)$       # ends with dot or hyphen
      |[^a-z0-9-.\*] # anything except characters, numbers, hyphen, dot and *
    ///.test pattern

  test: (host, pattern = @pattern) ->
    ///
      ^
      #{pattern}
      $
    ///.test host
    
class Path

  constructor: (@originalPattern) ->
    @pattern = @sanitize @originalPattern

  sanitize: (pattern = @originalPattern) ->
    pattern
      # Assume trailing slash at the end of path as optional, but not if it is
      # the first one.
      .replace(/(?!^)\/\*$/, '(/*|$)')
      # Allow letters, numbers, hyphens and dots and slashes instead of *.
      .replace(/\*/g, '[a-z0-9-./]*')

  validate: (pattern = @originalPattern) ->
    ///
      ^/    # must start with slash
    ///.test pattern

  test: (path, pattern = @pattern) ->
    ///
      ^
      #{pattern}
      $
    ///.test path

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
