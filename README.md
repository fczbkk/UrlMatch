# UrlMatch

JavaScript library for URL pattern matching using Chrome extension-style patterns with additional support for URL parameters and fragments.

## Features

- Chrome extension [match patterns](http://developer.chrome.com/extensions/match_patterns.html) compatible
- URL parameter matching with wildcards
- URL fragment matching
- Strict mode for precise parameter validation
- Debug mode for pattern troubleshooting
- Works in both Node.js and browsers
- Supports ESM and CommonJS

## Installation

```bash
npm install @fczbkk/url-match
```

## Usage

```javascript
// CommonJS
const UrlMatch = require('@fczbkk/url-match');

// ESM
import UrlMatch from '@fczbkk/url-match';
```

## Table of Contents

- [Basic Usage](#basic-usage)
  - [URL Validation](#url-validation)
  - [Match Against Pattern](#match-against-pattern)
  - [Match Against Multiple Patterns](#match-against-multiple-patterns)
  - [Add or Remove Patterns](#add-or-remove-patterns)
  - [Match URL Paths](#match-url-paths)
- [Advanced Features](#advanced-features)
  - [Match URL Parameters](#match-url-parameters)
  - [Strict Mode for Params](#strict-mode-for-params)
  - [Match URL Fragments](#match-url-fragments)
- [Debugging](#debugging)

## Basic Usage

### URL Validation

In its simplest form, you can use it as a generic URL validator.

```javascript
const myMatch = new UrlMatch('*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('https://www.google.com/preferences?hl=en'); // true
myMatch.test('this.is.not/valid.url'); // false
```

### Match Against Pattern

Match URLs against specific patterns.

```javascript
const myMatch = new UrlMatch('*://*.google.com/*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://calendar.google.com/'); // true
myMatch.test('https://www.google.com/preferences?hl=en'); // true
myMatch.test('http://www.facebook.com/'); // false
myMatch.test('http://www.google.sucks.com/'); // false
```

### Match Against Multiple Patterns

You can match against a list of patterns.

```javascript
const myMatch = new UrlMatch(['*://*.google.com/*', '*://*.facebook.com/*']);
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://www.facebook.com/'); // true
myMatch.test('http://www.apple.com/'); // false
```

### Add or Remove Patterns

You can add and remove patterns dynamically.

```javascript
const myMatch = new UrlMatch('*://*.google.com/*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://www.facebook.com/'); // false

myMatch.add('*://*.facebook.com/*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://www.facebook.com/'); // true

myMatch.remove('*://*.google.com/*');
myMatch.test('http://www.google.com/'); // false
myMatch.test('http://www.facebook.com/'); // true
```

### Match URL Paths

```javascript
const myMatch = new UrlMatch('*://*.google.com/*/preferences');
myMatch.test('http://www.google.com/preferences'); // false
myMatch.test('http://www.google.com/aaa/preferences'); // true
myMatch.test('http://www.google.com/aaa/preferences/bbb'); // false
```

## Advanced Features

### Match URL Parameters

Beyond Chrome's pattern matching, you can match URL query parameters.

Check for any parameter:

```javascript
const myMatch = new UrlMatch('*://*/*?aaa=*');
myMatch.test('http://google.com/?aaa=bbb'); // true
myMatch.test('http://facebook.com/?aaa=ccc'); // true
myMatch.test('http://apple.com/?aaa=bbb&ccc=ddd'); // true
myMatch.test('http://google.com/'); // false
```

Check for specific parameter values:

```javascript
const myMatch = new UrlMatch('*://*/*?aaa=bbb');
myMatch.test('http://google.com/?aaa=bbb'); // true
myMatch.test('http://google.com/?aaa=ccc'); // false
```

Use wildcards in parameter values:

```javascript
const myMatch = new UrlMatch('*://*/*?aaa=bbb*');
myMatch.test('http://google.com/?aaa=bbb'); // true
myMatch.test('http://google.com/?aaa=bbbccc'); // true
```

Match any parameter name with a specific value:

```javascript
const myMatch = new UrlMatch('*://*/*?*=ccc');
myMatch.test('http://google.com/?aaa=ccc'); // true
myMatch.test('http://google.com/?bbb=ccc'); // true
```

Parameter order doesn't matter:

```javascript
const myMatch = new UrlMatch('*://*/*?aaa=bbb&ccc=ddd');
myMatch.test('http://google.com/?aaa=bbb&ccc=ddd'); // true
myMatch.test('http://google.com/?ccc=ddd&aaa=bbb'); // true
```

### Strict Mode for Params

Activate strict mode by prepending `!` to the parameter pattern. In strict mode, all parameter patterns must match exactly with no extra parameters allowed.

```javascript
const myMatch = new UrlMatch('*://*/*?!aaa=*');
myMatch.test('http://google.com/?aaa=bbb'); // true
myMatch.test('http://google.com/'); // false (param missing)
myMatch.test('http://google.com/?aaa=bbb&ccc=ddd'); // false (too many params)
```

### Match URL Fragments

Beyond Chrome's pattern matching, you can match URL fragments (the part after `#`).

Match specific fragments:

```javascript
const myMatch = new UrlMatch('*://*/*#aaa');
myMatch.test('http://google.com/#aaa'); // true
myMatch.test('http://google.com/#bbb'); // false
```

Use wildcards in fragments:

```javascript
const myMatch = new UrlMatch('*://*/*#aaa*');
myMatch.test('http://google.com/#aaa'); // true
myMatch.test('http://google.com/#aaabbb'); // true
```

## Debugging

Use the `debug()` method to get detailed information about how each URL part matches against the pattern. Instead of a boolean, it returns an object showing the pattern, value, and result for each URL component.

```javascript
const myMatch = new UrlMatch('*://aaa.bbb/');
myMatch.debug('http://aaa.bbb/');
// Returns:
{
  "*://aaa.bbb/": {
    "scheme": {
      "pattern": "*",
      "value": "http",
      "result": true
    },
    "host": {
      "pattern": "aaa.bbb",
      "value": "aaa.bbb",
      "result": true
    },
    "path": {
      "pattern": "",
      "value": "",
      "result": true
    },
    "params": {
      "pattern": null,
      "value": null,
      "result": true
    },
    "fragment": {
      "pattern": null,
      "value": null,
      "result": true
    }
  }
}
```

## Contributing

Found a bug or have a feature request? Please [file an issue on GitHub](https://github.com/fczbkk/UrlMatch/issues).

## License

MIT License - see [LICENSE](https://github.com/fczbkk/UrlMatch/blob/master/LICENSE) file for details.
