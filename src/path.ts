import UrlPart from './url-part.js';

export default class Path extends UrlPart {
  get default_value(): string {
    return '';
  }

  get sanitize_replacements() {
    return [
      // escape all RegExp metacharacters except the `*` wildcard
      // (`/` stays literal, it is not a metacharacter in RegExp constructor)
      {substring: /[.+?^${}()|[\]\\]/g, replacement: '\\$&'},
      // assume trailing slash at the end of path is optional
      {substring: /\/$/, replacement: '\\/?'},
      {substring: /\/\*$/, replacement: '((\/?)|\/*)'},
      // allow letters, numbers, plus signs, hyphens, dots, slashes
      // and underscores instead of wildcard
      {substring: /\*/g, replacement: '[a-zA-Z0-9\+-./_:~!$&\'\(\)\*,;=@%]*'}
    ];
  }
}
