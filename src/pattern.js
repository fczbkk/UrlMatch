import Scheme from './scheme';
import Host from './host';
import Path from './path';
import Params from './params';
import Fragment from './fragment';
import exists from './utilities/exists';


const split_re = new RegExp(
  '^'                      + // beginning
  '([a-z]+|\\*)*'          + // (1) scheme
  '://'                    + // scheme separator
  '(.+@)*'                 + // (2) username and/or password
  '([\\w\\*\\.\\-]+)*'     + // (3) host
  '(\\:\\d+)*'             + // (4) port number
  '(/([^\\?\\#]*))*'       + // (5) path, (6) excluding slash
  '(\\?([^\\#]*))*'        + // (7) params, (8) excluding question mark
  '(\\#(.*))*'               // (9) fragment, (10) excluding hash
);


const parts_map = {
  scheme: 1,
  host: 3,
  path: 6,
  params: 8,
  fragment: 10
};


export default class {

  constructor (pattern) {
    if (pattern === '*' || pattern === '<all_urls>') {
      pattern = '*://*/*?*#*';
    }

    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
    this.url_parts = this.getUrlParts(this.pattern);
  }

  split (pattern = '', empty_value = null) {
    const result = {};
    const parts = pattern.match(split_re);

    for (const key in parts_map) {
      const val = parts_map[key];
      result[key] = (exists(parts) && exists(parts[val]))
        ? parts[val]
        : empty_value;
    }

    return result;
  }

  getUrlParts (pattern = this.pattern) {
    const splits = this.split(pattern);
    return {
      scheme: new Scheme(splits.scheme),
      host: new Host(splits.host),
      path: new Path(splits.path),
      params: new Params(splits.params),
      fragment: new Fragment(splits.fragment)
    }
  }

  sanitize (pattern = this.original_pattern) {
    const universal_pattern = '*://*/*?*#*';
    if (pattern === '*' || pattern === '<all_urls>') {
      pattern = universal_pattern;
    }
    return pattern;
  }

  validate (url_parts = this.url_parts) {
    let result = true;

    for (const key in url_parts) {
      const val = url_parts[key];
      if (!val.validate()) {
        result = false;
      }
    }

    return result;
  }

  test (url) {
    let result = false;

    if (exists(url)) {
      result = true;
      const splits = this.split(url);
      ['scheme', 'host', 'path', 'params', 'fragment'].forEach((part) => {
        if (!this.url_parts[part].test(splits[part])) {
          result = false;
        }
      });
    }

    return result;
  }

  debug (url) {
    const splits = this.split(url);
    const result = {};

    Object.keys(splits).forEach((key) => {
      result[key] = {
        pattern: this.url_parts[key].original_pattern,
        value: splits[key],
        result: this.url_parts[key].test(splits[key])
      }
    });

    return result;
  }

}


