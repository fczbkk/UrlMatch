import UrlPart from './url-part';
import exists from './utilities/exists';


export default class extends UrlPart {

  get is_required () {
    return false;
  }

  get invalidate_rules () {
    return [
      // two equal signs in a row
      /==/,
      // equal signs undivided by ampersand
      /=[^&]+=/,
      // single equal sign
      /^=$/
    ];
  }

  sanitize (pattern = this.original_pattern) {
    // strict mode
    if (typeof pattern === 'string' && pattern.substring(0, 1) === '!') {
      pattern = pattern.substring(1);
      this.is_strict = true;
    }

    if (pattern === '*' || pattern === '') {
      pattern = null
    }

    const result = [];

    if (exists(pattern)) {

      // replace asterisks
      pattern.split('&').forEach((pair) => {
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

  test (content = '', patterns = this.pattern) {
    let result = true;

    if (exists(patterns)) {

      result = patterns.reduce((previous_result, pattern) => {
        const re = new RegExp('(^|\&)' + pattern + '(\&|$)');
        return previous_result && re.test(content);
      }, result);

      if (this.is_strict === true) {
        if (typeof content === 'string') {
          const wrapped_patterns = patterns
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
