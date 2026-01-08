import Pattern, { type UrlMatchPatternDebug, type UrlMatchFragmentDebug } from './pattern.js';

// Export types for TypeScript users
export type { UrlMatchPatternDebug, UrlMatchFragmentDebug };

export default class UrlMatch {
  private pattern_set: Set<string>;
  private pattern_cache: Map<string, Pattern>;

  constructor(patterns: string | string[] = []) {
    this.pattern_set = new Set();
    this.pattern_cache = new Map();
    this.add(patterns);
  }

  get patterns(): string[] {
    return Array.from(this.pattern_set);
  }

  add(patterns: string | string[] = []): string[] {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    patterns.forEach((pattern) => {
      if (!this.pattern_set.has(pattern)) {
        this.pattern_set.add(pattern);
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

    patterns.forEach((pattern) => {
      if (this.pattern_set.has(pattern)) {
        this.pattern_set.delete(pattern);
        // Remove from cache when pattern is removed
        this.pattern_cache.delete(pattern);
      }
    });

    return this.patterns;
  }

  test(content: string): boolean {
    for (const pattern of this.pattern_set) {
      // Use cached Pattern object instead of creating new one
      const pattern_obj = this.pattern_cache.get(pattern);
      if (pattern_obj && pattern_obj.test(content) === true) {
        return true;
      }
    }

    return false;
  }

  debug(content: string): Record<string, UrlMatchPatternDebug> {
    const result: Record<string, UrlMatchPatternDebug> = {};

    for (const pattern of this.pattern_set) {
      // Use cached Pattern object instead of creating new one
      const pattern_obj = this.pattern_cache.get(pattern);
      if (pattern_obj) {
        result[pattern] = pattern_obj.debug(content);
      }
    }

    return result;
  }
}
