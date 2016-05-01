import UrlPart from './url-part';
import exists from './utilities/exists';


export default class extends UrlPart {

  validate (pattern = this.original_pattern) {
    if (exists(pattern)) {
      const re = new RegExp(
        '^(' +
        '\\*' +     // single wildcard
        '|' +       // or
        '[a-z]+' +  // any string of lowercase letters
        ')$'
      );
      return re.test(pattern);
    }
    return false;
  }

  get sanitize_replacements () {
    return [
      // when using wildcard, only match http(s)
      {substring: '*', replacement: 'https?'}
    ];
  }

}
