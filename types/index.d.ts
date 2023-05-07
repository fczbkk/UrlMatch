interface UrlMatchFragmentDebug {
  pattern: string,
  value: string,
  result: boolean
}

interface UrlMatchPatternDebug {
  scheme: UrlMatchFragmentDebug,
  host: UrlMatchFragmentDebug,
  path: UrlMatchFragmentDebug,
  params: UrlMatchFragmentDebug,
  fragment: UrlMatchFragmentDebug,
}

export default class UrlMatch {
  constructor(patterns?: string[]);
  add(patterns?: string[]): string[];
  remove(patterns?: string[]): string[];
  test(content: string): boolean;
  debug(content: string): Record<string, UrlMatchPatternDebug>;
}
