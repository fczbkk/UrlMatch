import UrlPart from './url-part.js';
import exists from './utilities/exists.js';

export default class Params extends UrlPart {
  get is_required(): boolean {
    return false;
  }

  get invalidate_rules(): RegExp[] {
    return [
      // two equal signs in a row
      /==/,
      // equal signs undivided by ampersand
      /=[^&]+=/,
      // single equal sign
      /^=$/
    ];
  }

  sanitize(pattern: string | null = this.original_pattern): string[] | null {
    // strict mode
    if (typeof pattern === 'string' && pattern.substring(0, 1) === '!') {
      pattern = pattern.substring(1);
      this.is_strict = true;
    }

    if (pattern === '*' || pattern === '') {
      pattern = null;
    }

    const result: string[] = [];

    if (exists(pattern)) {
      // replace asterisks
      (pattern as string).split('&').forEach((pair) => {
        let [key, val] = pair.split('=');

        // if key is asterisk, then at least one character is required
        key = (key === '*') ? '.+' : key.replace(/\*/g, '.*');

        if (!exists(val) || val === '') {
          // if value is missing, it is prohibited
          // only equal sign is allowed
          val = '=?';
        } else {
          // if value match is universal, the value is optional
          // thus the equal sign is optional
          val = (val === '*') ? '=?.*' : '=' + val.replace(/\*/g, '.*');
        }

        // escape all brackets
        val = val.replace(/[\[\](){}]/g, '\\$&');

        result.push(key + val);
      });
    }

    return result;
  }

  test(content: string | null = '', patterns: string[] | null = this.pattern as string[] | null): boolean {
    let result = true;

    if (exists(patterns)) {
      // special case, when we want to strictly match no params, e.g. '*://*/*?!'
      if (this.is_strict && (content === null) && ((patterns as string[]).length === 0)) {
        return true;
      }

      result = (patterns as string[]).reduce((previous_result, pattern) => {
        const re = new RegExp('(^|\&)' + pattern + '(\&|$)');
        return previous_result && re.test(content as string);
      }, result);

      if (this.is_strict === true) {
        if (typeof content === 'string') {
          const wrapped_patterns = (patterns as string[])
            .map((pattern) => `(${pattern})`)
            .join('|');
          const re = new RegExp('(^|\&)(' + wrapped_patterns + ')(\&|$)');

          result = content.split('&').reduce((previous_result, pair) => {
            return previous_result && re.test(pair);
          }, result);
        } else {
          result = false;
        }
      }
    }

    return result;
  }
}
