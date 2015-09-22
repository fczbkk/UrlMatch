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
      pattern_obj = new UrlMatch.Pattern pattern
      return true if pattern_obj.test content
    false

  class @Pattern

    constructor: (pattern) ->
      pattern = '*://*/*?*#*' if pattern in ['*', '<all_urls>']
      @original_pattern = pattern
      sanitized_pattern = @sanitize pattern
      @pattern = sanitized_pattern
      @url_parts = @getUrlParts sanitized_pattern

    split_re: ///
      ^                      # beginning
      ([a-z]+|\*)*           # (1) scheme
      ://                    # scheme separator
      (.+@)*                 # (2) username and/or password
      ([\w\*\.\-]+)*         # (3) host
      (\:\d+)*               # (4) port number
      (/([^\?\#]*))*         # (5) path, (6) excluding slash
      (\?([^\#]*))*          # (7) params, (8) excluding question mark
      (\#(.*))*              # (9) fragment, (10) excluding hash
    ///

    split: (pattern = '', empty_value = null) ->
      parts = pattern.match @split_re
      parts_map = {scheme: 1, host: 3, path: 6, params: 8, fragment: 10}
      result = {}
      for key, val of parts_map
        result[key] = parts?[val] or empty_value
      result

    getUrlParts: (pattern = @pattern) ->
      splits = @split pattern
      {
        scheme: new UrlMatch.Scheme splits.scheme
        host: new UrlMatch.Host splits.host
        path: new UrlMatch.Path splits.path
        params: new UrlMatch.Params splits.params
        fragment: new UrlMatch.Fragment splits.fragment
      }

    sanitize: (pattern = @original_pattern) ->
      universal_pattern = '*://*/*?*#*'
      pattern = universal_pattern if pattern in ['*', '<all_urls>']
      pattern

    validate: (url_parts = @url_parts) ->
      result = true
      for key, val of url_parts
        result = false if not val.validate()
      result

    test: (url) ->
      if url?
        splits = @split url
        result = true
        for part in ['scheme', 'host', 'path', 'params', 'fragment']
          result = false if not @url_parts[part].test splits[part]
        result
      else
        false

  class @UrlPart
    constructor: (pattern) ->
      @original_pattern = pattern
      @pattern = @sanitize pattern

    validate: (pattern = @original_pattern) ->
      false

    test: (content = '', pattern = @pattern) ->
      if pattern?
        pattern.test content
      else
        true

    sanitize: (pattern = @original_pattern) ->
      if @validatePattern
        ///
          ^
          #{pattern}
          $
        ///
      else
        null

  class @Scheme extends @UrlPart

    validate: (pattern = @original_pattern) ->
      if pattern?
        ///
          ^(
          \*         # single asterisk
          | [a-z]+   # or any string of lowercase letters
          )$
        ///.test pattern
      else
        false

    sanitize: (pattern = @original_pattern) ->
      if @validate pattern
        pattern = pattern.replace '*', 'https?'
        ///
          ^
          #{pattern}
          $
        ///
      else
        null

  class @Host extends @UrlPart

    validate: (pattern = @original_pattern) ->
      if pattern?
        validate_rules = [
          /.+/            # should not be empty
        ]
        invalidate_rules = [
          /\*\*/          # two asterisks in a row
          /\*[^\.]+/      # asterisk not followed by a dot
          /.\*/           # asterisk not at the beginning
          /^(\.|-)/       # starts with dot or hyphen
          /(\.|-)$/       # ends with dot or hyphen
          /[^a-z0-9-.\*]/ # anything except characters, numbers, hyphen, dot
                          # and asterisk
        ]
        result = true

        for rule in validate_rules
          result = false if not rule.test pattern

        for rule in invalidate_rules
          result = false if rule.test pattern

        result
      else
        false

    sanitize: (pattern = @original_pattern) ->
      if @validate pattern
        pattern = pattern.replace '.', '\\.'
        pattern = pattern.replace '*', '[a-z0-9-.]+'
        ///
          ^
          #{pattern}
          $
        ///
      else
        null

  class @Path extends @UrlPart

    validate: (pattern = @original_pattern) ->
      true

    sanitize: (pattern = @original_pattern) ->
      pattern = '' unless pattern?

      # Assume trailing slash at the end of path is optional.
      pattern = pattern.replace /\/$/, '\\/?'
      pattern = pattern.replace /\/\*$/, '((\/?)|\/*)'
      # Allow letters, numbers, hyphens, dots, slashes and underscores
      # instead of *.
      pattern = pattern.replace /\*/g, '[a-zA-Z0-9-./_]*'

      ///
        ^
        #{pattern}
        $
      ///

  class @Params extends @UrlPart

    validate: (pattern = @original_pattern) ->
      if pattern?
        invalidate_rules = [
          /\=\=/          # two equal signs in a row
          /\=[^\&]+\=/    # equal signs undivided by ampersand
          /^\=$/          # single equal sign
        ]
        result = true

        for rule in invalidate_rules
          result = false if rule.test pattern

        result
      else
        true

    sanitize: (pattern = @original_pattern) ->
      # single asterisk is universal selector
      pattern = null if pattern is '*'
      result = {}
      if pattern?
        # replace asterisks
        for pair in pattern.split '&'
          [key, val] = pair.split '='
          # if key is asterisk, then at least one character is required
          key = if key is '*' then '.+' else key.replace /\*/g, '.*'
          # if value match is universal, the value is optional, thus the
          # equal sign is optional
          val = if val is '*' then '=?.*' else '=' + val.replace /\*/g, '.*'
          # escape all brackets
          val = val.replace /[\[\](){}]/g, '\\$&'

          result[key] = val
      result

    test: (content = '', pattern = @pattern) ->
      result = true
      for key, val of pattern
        re = ///
          (^|\&)        # either begining of the string or ampersand
          #{key}#{val}
          (\&|$)        # either endo of the string or ampersand
        ///
        result = false if not re.test content
      result

  class @Fragment extends @UrlPart

    validate: (pattern = @original_pattern) ->
      if pattern?
        invalidate_rules = [
          /\#/          # must not contain hash sign
        ]
        result = true

        for rule in invalidate_rules
          result = false if rule.test pattern

        result
      else
        true

    sanitize: (pattern = @original_pattern) ->
      if @validate pattern
        if pattern?
          pattern = pattern.replace /\*/g, '.*'
          return ///
            ^
            #{pattern}
            $
          ///
      null

# Expose object to the global namespace.
if expose?
  expose UrlMatch, 'UrlMatch'
else
  root = if typeof exports is 'object' then exports else this
  root.UrlMatch = UrlMatch
