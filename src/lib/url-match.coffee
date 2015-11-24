# URL Matcher in the style of Google Chrome:
# http://developer.chrome.com/extensions/match_patterns.html

class UrlMatch

  constructor: (patterns = []) ->
    @patterns = []
    @add patterns

  add: (patterns = []) ->
    patterns = [patterns] if typeof patterns is 'string'
    for pattern in patterns
      @patterns.push pattern if pattern not in @patterns
    @patterns

  remove: (patterns = []) ->
    patterns = [patterns] if typeof patterns is 'string'
    @patterns = @patterns.filter (item) ->
      item not in patterns

  test: (content) ->
    for pattern in @patterns
      pattern_obj = new Pattern pattern
      return true if pattern_obj.test content
    false


# Expose object to the global namespace.
if expose?
  expose UrlMatch, 'UrlMatch'
else
  root = if typeof exports is 'object' then exports else this
  root.UrlMatch = UrlMatch
