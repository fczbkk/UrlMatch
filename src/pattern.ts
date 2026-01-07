import Scheme from './scheme.js';
import Host from './host.js';
import Path from './path.js';
import Params from './params.js';
import Fragment from './fragment.js';
import exists from './utilities/exists.js';

const split_re = new RegExp(
  '^'                      + // beginning
  '([a-z]+|\\*)*'          + // (1) scheme
  '://'                    + // scheme separator
  '([^\\/\\#\\?]+@)*'      + // (2) username and/or password
  '([\\w\\*\\.\\-]+)*'     + // (3) host
  '(\\:\\d+)*'             + // (4) port number
  '(/([^\\?\\#]*))*'       + // (5) path, (6) excluding slash
  '(\\?([^\\#]*))*'        + // (7) params, (8) excluding question mark
  '(\\#(.*))*'               // (9) fragment, (10) excluding hash
);

const parts_map: Record<string, number> = {
  scheme: 1,
  host: 3,
  path: 6,
  params: 8,
  fragment: 10
};

interface UrlParts {
  scheme: Scheme;
  host: Host;
  path: Path;
  params: Params;
  fragment: Fragment;
}

interface UrlSplits {
  scheme: string | null;
  host: string | null;
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
  path: UrlMatchFragmentDebug;
  params: UrlMatchFragmentDebug;
  fragment: UrlMatchFragmentDebug;
}

export default class Pattern {
  original_pattern: string;
  pattern: string;
  url_parts: UrlParts;

  constructor(pattern: string) {
    if (pattern === '*' || pattern === '<all_urls>') {
      pattern = '*://*/*?*#*';
    }

    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
    this.url_parts = this.getUrlParts(this.pattern);
  }

  split(pattern: string = '', empty_value: null = null): UrlSplits {
    const result: UrlSplits = {
      scheme: null,
      host: null,
      path: null,
      params: null,
      fragment: null
    };
    const parts = pattern.match(split_re);

    if (exists(parts) && parts !== null) {
      for (const key in parts_map) {
        const val = parts_map[key];
        result[key as keyof UrlSplits] = exists(parts[val])
          ? (parts[val] as string)
          : empty_value;
      }
    }

    return result;
  }

  getUrlParts(pattern: string = this.pattern): UrlParts {
    const splits = this.split(pattern);
    return {
      scheme: new Scheme(splits.scheme),
      host: new Host(splits.host),
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
    let result = true;

    for (const key in url_parts) {
      const val = url_parts[key as keyof UrlParts];
      if (!val.validate()) {
        result = false;
      }
    }

    return result;
  }

  test(url: string): boolean {
    let result = false;

    if (exists(url)) {
      result = true;
      const splits = this.split(url);
      (['scheme', 'host', 'path', 'params', 'fragment'] as const).forEach((part) => {
        if (!this.url_parts[part].test(splits[part])) {
          result = false;
        }
      });
    }

    return result;
  }

  debug(url: string): UrlMatchPatternDebug {
    const splits = this.split(url);

    return {
      scheme: {
        pattern: this.url_parts.scheme.original_pattern,
        value: splits.scheme,
        result: this.url_parts.scheme.test(splits.scheme)
      },
      host: {
        pattern: this.url_parts.host.original_pattern,
        value: splits.host,
        result: this.url_parts.host.test(splits.host)
      },
      path: {
        pattern: this.url_parts.path.original_pattern,
        value: splits.path,
        result: this.url_parts.path.test(splits.path)
      },
      params: {
        pattern: this.url_parts.params.original_pattern,
        value: splits.params,
        result: this.url_parts.params.test(splits.params)
      },
      fragment: {
        pattern: this.url_parts.fragment.original_pattern,
        value: splits.fragment,
        result: this.url_parts.fragment.test(splits.fragment)
      }
    };
  }
}
