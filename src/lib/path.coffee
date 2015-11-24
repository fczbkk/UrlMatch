class Path extends UrlPart

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
