import Scheme from './scheme.js';
import Host from './host.js';
import Port from './port.js';
import Path from './path.js';
import Params from './params.js';
import Fragment from './fragment.js';

/**
 * Regular expression to parse URL patterns into components.
 * Uses named groups for better readability and maintainability.
 *
 * Format: scheme://[user:pass@]host[:port]/path?params#fragment
 *
 * Named groups:
 * - scheme: Protocol (http, https, *, etc.)
 * - host: Domain name (with optional wildcards)
 * - port: Port number (or wildcard)
 * - path: URL path (without leading slash)
 * - params: Query parameters (without leading ?)
 * - fragment: Hash fragment (without leading #)
 */
const split_re = new RegExp(
  '^'                                  + // Start of string
  '(?<scheme>[a-zA-Z]+|\\*)?'          + // scheme: protocol or wildcard (optional)
  '://'                                + // scheme separator
  '(?:[^\\/\\#\\?]+@)?'                + // username/password (ignored, non-capturing)
  '(?<host>[\\w\\*\\.\\-]+)?'          + // host: domain with wildcards (optional)
  '(?:\\:(?<port>[\\d\\*]+))?'         + // port: port number with wildcards (optional)
  '(?:/(?<path>[^\\?\\#]*))?'          + // path: everything after / but before ? or # (optional)
  '(?:\\?(?<params>[^\\#]*))?'         + // params: everything after ? but before # (optional)
  '(?:\\#(?<fragment>.*))?'            + // fragment: everything after # (optional)
  '$'                                    // End of string
);

const URL_PARTS = ['scheme', 'host', 'port', 'path', 'params', 'fragment'] as const;

// well-known ports used when a tested URL does not state one explicitly
const DEFAULT_PORTS: Record<string, string> = {
  http: '80',
  https: '443'
};

interface UrlParts {
  scheme: Scheme;
  host: Host;
  port: Port;
  path: Path;
  params: Params;
  fragment: Fragment;
}

interface UrlSplits {
  scheme: string | null;
  host: string | null;
  port: string | null;
  path: string | null;
  params: string | null;
  fragment: string | null;
}

export interface UrlMatchFragmentDebug {
  pattern: string | null;
  value: string | null;
  result: boolean;
}

export interface UrlMatchPatternDebug {
  scheme: UrlMatchFragmentDebug;
  host: UrlMatchFragmentDebug;
  port: UrlMatchFragmentDebug;
  path: UrlMatchFragmentDebug;
  params: UrlMatchFragmentDebug;
  fragment: UrlMatchFragmentDebug;
}

export default class Pattern {
  original_pattern: string;
  pattern: string;
  url_parts: UrlParts;
  is_valid: boolean;

  constructor(pattern: string) {
    if (pattern === '*' || pattern === '<all_urls>') {
      pattern = '*://*/*?*#*';
    }

    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
    this.url_parts = this.getUrlParts(this.pattern);
    this.is_valid = this.validate(this.url_parts);
  }

  split(pattern: string = '', empty_value: null = null): UrlSplits {
    const result: UrlSplits = {
      scheme: null,
      host: null,
      port: null,
      path: null,
      params: null,
      fragment: null
    };
    const match = pattern.match(split_re);

    if (match?.groups) {
      for (const part of URL_PARTS) {
        result[part] = match.groups[part] ?? empty_value;
      }
    }

    return result;
  }

  getUrlParts(pattern: string = this.pattern): UrlParts {
    const splits = this.split(pattern);
    return {
      scheme: new Scheme(splits.scheme),
      host: new Host(splits.host),
      port: new Port(splits.port),
      path: new Path(splits.path),
      params: new Params(splits.params),
      fragment: new Fragment(splits.fragment)
    };
  }

  sanitize(pattern: string = this.original_pattern): string {
    const universal_pattern = '*://*/*?*#*';
    if (pattern === '*' || pattern === '<all_urls>') {
      pattern = universal_pattern;
    }
    return pattern;
  }

  validate(url_parts: UrlParts = this.url_parts): boolean {
    for (const key in url_parts) {
      const val = url_parts[key as keyof UrlParts];
      if (!val.validate()) {
        return false;
      }
    }

    return true;
  }

  // split a tested URL, normalizing the case-insensitive parts
  // (scheme and host) so they match lowercase patterns
  splitUrl(url: string): UrlSplits {
    const splits = this.split(url);
    if (splits.scheme != null) {
      splits.scheme = splits.scheme.toLowerCase();
    }
    if (splits.host != null) {
      splits.host = splits.host.toLowerCase();
    }
    // URL without an explicit port is served on the scheme's default port
    if (splits.port == null && splits.scheme != null) {
      splits.port = DEFAULT_PORTS[splits.scheme] ?? null;
    }
    return splits;
  }

  test(url: string): boolean {
    // invalid pattern must never match any URL
    if (!this.is_valid || url == null) {
      return false;
    }

    const splits = this.splitUrl(url);
    for (const part of URL_PARTS) {
      if (!this.url_parts[part].test(splits[part])) {
        return false;
      }
    }

    return true;
  }

  debug(url: string): UrlMatchPatternDebug {
    const splits = this.splitUrl(url);
    const result = {} as UrlMatchPatternDebug;

    for (const part of URL_PARTS) {
      const url_part = this.url_parts[part];
      result[part] = {
        pattern: url_part.original_pattern,
        value: splits[part],
        // part of an invalid pattern must never report a match
        result: url_part.validate() && url_part.test(splits[part])
      };
    }

    return result;
  }
}
