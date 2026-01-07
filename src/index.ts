import Pattern, { type UrlMatchPatternDebug, type UrlMatchFragmentDebug } from './pattern.js';

// Export types for TypeScript users
export type { UrlMatchPatternDebug, UrlMatchFragmentDebug };

export default class UrlMatch {
  patterns: string[];
  private patternCache: Map<string, Pattern>;

  constructor(patterns: string | string[] = []) {
    this.patterns = [];
    this.patternCache = new Map();
    this.add(patterns);
  }

  add(patterns: string | string[] = []): string[] {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    patterns.forEach((pattern) => {
      if (this.patterns.indexOf(pattern) === -1) {
        this.patterns.push(pattern);
        // Cache the Pattern object for this pattern
        this.patternCache.set(pattern, new Pattern(pattern));
      }
    });

    return this.patterns;
  }

  remove(patterns: string | string[] = []): string[] {
    if (typeof patterns === 'string') {
      patterns = [patterns];
    }

    // Convert to Set for O(1) lookups instead of O(n)
    const patternsToRemove = new Set(patterns);

    this.patterns = this.patterns.filter((pattern) => {
      const shouldRemove = patternsToRemove.has(pattern);
      if (shouldRemove) {
        // Remove from cache when removing pattern
        this.patternCache.delete(pattern);
      }
      return !shouldRemove;
    });

    return this.patterns;
  }

  test(content: string): boolean {
    // Use some() for early termination when a match is found
    return this.patterns.some((pattern) => {
      const pattern_obj = this.patternCache.get(pattern);
      return pattern_obj ? pattern_obj.test(content) : false;
    });
  }

  debug(content: string): Record<string, UrlMatchPatternDebug> {
    const result: Record<string, UrlMatchPatternDebug> = {};

    this.patterns.forEach((pattern) => {
      const pattern_obj = this.patternCache.get(pattern);
      if (pattern_obj) {
        result[pattern] = pattern_obj.debug(content);
      }
    });

    return result;
  }
}
