import UrlPart from './url-part.js';

export default class Params extends UrlPart {
  private compiled_patterns!: RegExp[] | null;
  private strict_compiled_pattern!: RegExp | null;

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

    if (pattern != null) {
      // replace asterisks
      for (const pair of pattern.split('&')) {
        let [key, val] = pair.split('=');

        // if key is asterisk, then at least one character is required
        key = (key === '*') ? '.+' : key.replace(/\*/g, '.*');

        if (val == null || val === '') {
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
      }
    }

    // Pre-compile RegExps for performance (even if result is empty array)
    this.compiled_patterns = result.map((p) => new RegExp('(^|\\&)' + p + '(\\&|$)'));

    // Pre-compile strict mode RegExp if needed (even with empty patterns)
    if (this.is_strict) {
      const wrapped_patterns = result
        .map((p) => `(${p})`)
        .join('|');
      this.strict_compiled_pattern = new RegExp('(^|\\&)(' + wrapped_patterns + ')(\\&|$)');
    }

    return result;
  }

  test(content: string | null = '', patterns: string[] | null = this.pattern as string[] | null): boolean {
    let result = true;

    if (patterns != null) {
      // special case, when we want to strictly match no params, e.g. '*://*/*?!'
      if (this.is_strict && (content === null) && ((patterns as string[]).length === 0)) {
        return true;
      }

      // Use pre-compiled RegExps only if testing against this.pattern
      const useCache = patterns === this.pattern && this.compiled_patterns !== null;

      if (useCache && this.compiled_patterns) {
        for (const re of this.compiled_patterns) {
          if (!re.test(content as string)) {
            result = false;
            break;
          }
        }
      } else {
        // Fall back to creating RegExps on demand for non-cached patterns
        for (const pattern of patterns as string[]) {
          const re = new RegExp('(^|\\&)' + pattern + '(\\&|$)');
          if (!re.test(content as string)) {
            result = false;
            break;
          }
        }
      }

      if (this.is_strict === true) {
        if (typeof content === 'string') {
          if (useCache && this.strict_compiled_pattern) {
            for (const pair of content.split('&')) {
              if (!this.strict_compiled_pattern.test(pair)) {
                result = false;
                break;
              }
            }
          } else {
            // Fall back to creating RegExp on demand
            const wrapped_patterns = (patterns as string[])
              .map((p) => `(${p})`)
              .join('|');
            const re = new RegExp('(^|\\&)(' + wrapped_patterns + ')(\\&|$)');

            for (const pair of content.split('&')) {
              if (!re.test(pair)) {
                result = false;
                break;
              }
            }
          }
        } else {
          result = false;
        }
      }
    }

    return result;
  }
}
