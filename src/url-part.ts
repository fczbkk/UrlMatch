import exists from './utilities/exists.js';

interface SanitizeReplacement {
  substring: string | RegExp;
  replacement: string;
}

export default abstract class UrlPart {
  is_strict: boolean;
  original_pattern: string | null;
  pattern: RegExp | null | string[];

  constructor(pattern: string | null) {
    this.is_strict = false;
    this.original_pattern = pattern;
    this.pattern = this.sanitize(pattern);
  }

  get default_value(): string | null {
    return null;
  }

  get is_required(): boolean {
    return true;
  }

  get validate_rules(): RegExp[] {
    return [];
  }

  get invalidate_rules(): RegExp[] {
    return [];
  }

  validate(pattern: string | null = this.original_pattern): boolean {
    if (exists(pattern)) {
      // Use for...of for early termination possibility
      for (const rule of this.validate_rules) {
        if (!rule.test(pattern as string)) {
          return false;
        }
      }

      for (const rule of this.invalidate_rules) {
        if (rule.test(pattern as string)) {
          return false;
        }
      }

      return true;
    }

    return !this.is_required;
  }

  test(content: string | null = '', pattern: RegExp | string[] | null = this.pattern): boolean {
    if (content === null) {
      content = '';
    }

    if (exists(pattern) && pattern instanceof RegExp) {
      return pattern.test(content);
    }

    return true;
  }

  get sanitize_replacements(): SanitizeReplacement[] {
    return [];
  }

  sanitize(pattern: string | null = this.original_pattern): RegExp | null | string[] {
    if (!exists(pattern)) {
      pattern = this.default_value;
    }

    if (exists(pattern) && this.validate(pattern)) {
      this.sanitize_replacements.forEach(({substring, replacement}) => {
        pattern = (pattern as string).replace(substring, replacement);
      });
      return new RegExp('^' + pattern + '$');
    }
    return null;
  }
}
