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
    if (pattern === '*') {
      pattern = null
    }

    const result = {};

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

        result[key] = val;
      });

    }

    return result;
  }

  test (content = '', pattern = this.pattern) {
    let result = true;

    if (exists(pattern)) {
      for (const key in pattern) {
        const val = pattern[key];
        const re = new RegExp('(^|\&)' + key + val + '(\&|$)');
        if (!re.test(content)) {
          result = false;
        }
      }
    }

    return result;
  }

}
