import UrlPart from './url-part';


export default class extends UrlPart {

  get default_value () {
    return '';
  }

  get sanitize_replacements () {
    return [
      // add trailing slash if path is empty
      {substring: /^$/, replacement: '\/'},
      // add trailing slash if path does not end with asterisk or trailing slash
      {substring: /[^/*]$/, replacement: '$&\/'},
      // assume trailing slash at the end of path is optional
      {substring: /\/$/, replacement: '\\/?'},
      {substring: /\/\*$/, replacement: '((\/?)|\/*)'},
      // allow letters, numbers, hyphens, dots, slashes and underscores
      // instead of wildcard
      {substring: /\*/g, replacement: '[a-zA-Z0-9-./_]*'}
    ];
  }

}
