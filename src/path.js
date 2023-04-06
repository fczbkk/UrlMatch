import UrlPart from './url-part';


export default class extends UrlPart {

  get default_value () {
    return '';
  }

  get sanitize_replacements () {
    return [
      // escape brackets
      {substring: /\(/, replacement: '\\\('},
      {substring: /\)/, replacement: '\\\)'},
      // assume trailing slash at the end of path is optional
      {substring: /\/$/, replacement: '\\/?'},
      {substring: /\/\*$/, replacement: '((\/?)|\/*)'},
      // plus sign
      {substring: /\+/, replacement: '\\\+'},
      // allow letters, numbers, plus signs, hyphens, dots, slashes
      // and underscores instead of wildcard
      {substring: /\*/g, replacement: '[a-zA-Z0-9\+-./_:~!$&\'\(\)\*,;=@%]*'}
    ];
  }

}
