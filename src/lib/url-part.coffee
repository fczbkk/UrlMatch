class UrlPart
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
