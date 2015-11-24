class Scheme extends UrlPart

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
