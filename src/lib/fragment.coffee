class Fragment extends UrlPart

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
