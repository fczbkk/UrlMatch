import Pattern, { type UrlMatchPatternDebug, type UrlMatchFragmentDebug } from './pattern.js';

// Export types for TypeScript users
export type { UrlMatchPatternDebug, UrlMatchFragmentDebug };

export default class UrlMatch {
  patterns: string[];

  constructor(patterns: string | string[] = []) {
    this.patterns = [];
    this.add(patterns);
  }

  add(patterns: string | string[] = []): string[] {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    patterns.forEach((pattern) => {
      if (this.patterns.indexOf(pattern) === -1) {
        this.patterns.push(pattern);
      }
    });

    return this.patterns;
  }

  remove(patterns: string | string[] = []): string[] {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    this.patterns = this.patterns.filter((pattern) => {
      return patterns.indexOf(pattern) === -1;
    });

    return this.patterns;
  }

  test(content: string): boolean {
    let result = false;

    this.patterns.forEach((pattern) => {
      const pattern_obj = new Pattern(pattern);
      if (pattern_obj.test(content) === true) {
        result = true;
      }
    });

    return result;
  }

  debug(content: string): Record<string, UrlMatchPatternDebug> {
    const result: Record<string, UrlMatchPatternDebug> = {};

    this.patterns.forEach((pattern) => {
      const pattern_obj = new Pattern(pattern);
      result[pattern] = pattern_obj.debug(content);
    });

    return result;
  }
}
