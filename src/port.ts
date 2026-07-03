import UrlPart from './url-part.js';

export default class Port extends UrlPart {
  get is_required(): boolean {
    return false;
  }

  get validate_rules(): RegExp[] {
    return [
      // digits and wildcards only, e.g. "8080", "*" or "3*"
      /^[\d\*]{1,5}$/
    ];
  }

  get invalidate_rules(): RegExp[] {
    return [
      // two asterisks in a row
      /\*\*/
    ];
  }

  get sanitize_replacements() {
    return [
      // single wildcard requires a port number
      {substring: /^\*$/, replacement: '\\d+'},
      // partial wildcard matches any number of digits, e.g. "3*"
      // matches 3, 3000, 3001, etc.
      {substring: /\*/g, replacement: '\\d*'}
    ];
  }
}
