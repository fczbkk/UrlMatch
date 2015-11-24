class Params extends UrlPart

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
