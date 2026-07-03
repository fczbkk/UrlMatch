import UrlPart from './url-part.js';

export default class Fragment extends UrlPart {
  get is_required(): boolean {
    return false;
  }

  get invalidate_rules(): RegExp[] {
    return [
      // must not contain hash
      /#/
    ];
  }

  get sanitize_replacements() {
    return [
      // escape all RegExp metacharacters except the `*` wildcard
      {substring: /[.+?^${}()|[\]\\\/]/g, replacement: '\\$&'},
      {substring: /\*/g, replacement: '.*'}
    ];
  }
}
