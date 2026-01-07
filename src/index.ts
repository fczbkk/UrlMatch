import Pattern, { type UrlMatchPatternDebug, type UrlMatchFragmentDebug } from './pattern.js';

// Export types for TypeScript users
export type { UrlMatchPatternDebug, UrlMatchFragmentDebug };

export default class UrlMatch {
  patterns: string[];
  private pattern_cache: Map<string, Pattern>;

  constructor(patterns: string | string[] = []) {
    this.patterns = [];
    this.pattern_cache = new Map();
    this.add(patterns);
  }

  add(patterns: string | string[] = []): string[] {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    patterns.forEach((pattern) => {
      if (this.patterns.indexOf(pattern) === -1) {
        this.patterns.push(pattern);
        // Create and cache the Pattern object once
        this.pattern_cache.set(pattern, new Pattern(pattern));
      }
    });

    return this.patterns;
  }

  remove(patterns: string | string[] = []): string[] {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    this.patterns = this.patterns.filter((pattern) => {
      const shouldRemove = patterns.indexOf(pattern) !== -1;
      if (shouldRemove) {
        // Remove from cache when pattern is removed
        this.pattern_cache.delete(pattern);
      }
      return !shouldRemove;
    });

    return this.patterns;
  }

  test(content: string): boolean {
    let result = false;

    this.patterns.forEach((pattern) => {
      // Use cached Pattern object instead of creating new one
      const pattern_obj = this.pattern_cache.get(pattern);
      if (pattern_obj && pattern_obj.test(content) === true) {
        result = true;
      }
    });

    return result;
  }

  debug(content: string): Record<string, UrlMatchPatternDebug> {
    const result: Record<string, UrlMatchPatternDebug> = {};

    this.patterns.forEach((pattern) => {
      // Use cached Pattern object instead of creating new one
      const pattern_obj = this.pattern_cache.get(pattern);
      if (pattern_obj) {
        result[pattern] = pattern_obj.debug(content);
      }
    });

    return result;
  }
}
