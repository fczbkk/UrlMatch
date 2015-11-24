class Host extends UrlPart

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
      # make asterisk and dot at the beginning optional
      pattern = pattern.replace /^\*\./, '(*.)?'
      # escape all dots
      pattern = pattern.replace '.', '\\.'
      # replace asterisks with pattern
      pattern = pattern.replace '*', '[a-z0-9-.]+'
      ///
        ^
        #{pattern}
        $
      ///
    else
      null
