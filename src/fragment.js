import UrlPart from './url-part';


export default class extends UrlPart {

  get is_required () {
    return false;
  }

  get invalidate_rules () {
    return [
      // must not contain hash
      /#/
    ];
  }

  get sanitize_replacements () {
    return [
      {substring: /\*/g, replacement: '.*'}
    ];
  }

}
