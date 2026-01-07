import UrlPart from './url-part.js';
import exists from './utilities/exists.js';

export default class Scheme extends UrlPart {
  validate(pattern: string | null = this.original_pattern): boolean {
    if (exists(pattern)) {
      const re = new RegExp(
        '^(' +
        '\\*' +     // single wildcard
        '|' +       // or
        '[a-z]+' +  // any string of lowercase letters
        ')$'
      );
      return re.test(pattern as string);
    }
    return false;
  }

  get sanitize_replacements() {
    return [
      // when using wildcard, only match http(s)
      {substring: '*', replacement: 'https?'}
    ];
  }
}
