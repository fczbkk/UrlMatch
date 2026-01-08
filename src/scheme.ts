import UrlPart from './url-part.js';

export default class Scheme extends UrlPart {
  validate(pattern: string | null = this.original_pattern): boolean {
    if (pattern != null) {
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

  get sanitize_replacements() {
    return [
      // when using wildcard, only match http(s)
      {substring: '*', replacement: 'https?'}
    ];
  }
}
