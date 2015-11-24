class Pattern

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
      scheme: new Scheme splits.scheme
      host: new Host splits.host
      path: new Path splits.path
      params: new Params splits.params
      fragment: new Fragment splits.fragment
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
