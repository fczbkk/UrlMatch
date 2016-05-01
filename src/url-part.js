import exists from './utilities/exists';


export default class {

  constructor (pattern) {
    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
  }

  get default_value () {
    return null;
  }

  get is_required () {
    return true;
  }

  get validate_rules () {
    return [];
  }

  get invalidate_rules () {
    return [];
  }

  validate (pattern = this.original_pattern) {
    if (exists(pattern)) {
      let result = true;

      this.validate_rules.forEach((rule) => {
        if (!rule.test(pattern)) {
          result = false;
        }
      });

      this.invalidate_rules.forEach((rule) => {
        if (rule.test(pattern)) {
          result = false;
        }
      });

      return result;
    }

    return !this.is_required;
  }

  test (content = '', pattern = this.pattern) {
    if (content === null) {
      content = '';
    }

    if (exists(pattern)) {
      return pattern.test(content);
    }

    return true;
  }

  get sanitize_replacements () {
    return [];
  }

  sanitize (pattern = this.original_pattern) {
    if (!exists(pattern)) {
      pattern = this.default_value;
    }

    if (exists(pattern) && this.validate(pattern)) {
      this.sanitize_replacements.forEach(({substring, replacement}) => {
        pattern = pattern.replace(substring, replacement);
      });
      return new RegExp('^' + pattern + '$');
    }
    return null;
  }

}
