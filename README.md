# UrlMatch

JavaScript object that provides URL matching functionality using patterns similar to what is used in extensions in Google Chrome:
http://developer.chrome.com/extensions/match_patterns.html

On top of Chrome's pattern matching, this object can also check for specific URL parameters and fragments (see below).

## How to use

### URL validation

In it's most simple form, you can use it as a generic URL validator.

```javascript
myMatch = new UrlMatch('*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('https://www.google.com/preferences?hl=en'); // true
myMatch.test('this.is.not/valid.url'); // false
```

### Match against pattern

But what you usually want to do is to match it against some specific URL pattern.

```javascript
myMatch = new UrlMatch('*://*.google.com/*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://calendar.google.com/'); // true
myMatch.test('https://www.google.com/preferences?hl=en'); // true
myMatch.test('http://www.facebook.com/'); // false
myMatch.test('http://www.google.sucks.com/'); // false
```

## Match against multiple patterns

You can use it to match against a list of patterns.

```javascript
myMatch = new UrlMatch(['*://*.google.com/*', '*://*.facebook.com/*']);
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://www.facebook.com/'); // true
myMatch.test('http://www.apple.com/'); // false
```

### Add or remove patterns on the fly

You can add and remove the patterns on the fly.

```javascript
myMatch = new UrlMatch('*://*.google.com/*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://www.facebook.com/'); // false

myMatch.addPattern('*://*.facebook.com/*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://www.facebook.com/'); // true

myMatch.removePattern('*://*.google.com/*');
myMatch.test('http://www.google.com/'); // false
myMatch.test('http://www.facebook.com/'); // true
```

### Match URL paths

```javascript
myMatch = new UrlMatch('*://*.google.com/*/preferences');
myMatch.test('http://www.google.com/preferences'); // false
myMatch.test('http://www.google.com/aaa/preferences'); // true
myMatch.test('http://www.google.com/aaa/preferences/bbb'); // false
```

### Match URL parameters

NOTE: This functionality is not available in Chrome pattern matching.

You can check for URL parameters:

```javascript
myMatch = new UrlMatch('*://*/*?aaa=*');
myMatch.test('http://google.com/?aaa=bbb'); // true
myMatch.test('http://facebook.com/?aaa=ccc'); // true
myMatch.test('http://apple.com/?aaa=bbb&ccc=ddd'); // true
myMatch.test('http://google.com/'); // false
```

You can check for URL parameters with specific value:

```javascript
myMatch = new UrlMatch('*://*/*?aaa=bbb');
myMatch.test('http://google.com/?aaa=bbb'); // true
myMatch.test('http://google.com/?aaa=ccc'); // false
```

You can check for URL parameters using wildcards:

```javascript
myMatch = new UrlMatch('*://*/*?aaa=bbb*');
myMatch.test('http://google.com/?aaa=bbb'); // true
myMatch.test('http://google.com/?aaa=bbbccc'); // true
```

You can even check for any URL parameter with specific value:

```javascript
myMatch = new UrlMatch('*://*/*?*=ccc');
myMatch.test('http://google.com/?aaa=ccc'); // true
myMatch.test('http://google.com/?bbb=ccc'); // true
```

The order of parameters does not matter:

```javascript
myMatch = new UrlMatch('*://*/*?aaa=bbb&ccc=ddd');
myMatch.test('http://google.com/?aaa=bbb&ccc=ddd'); // true
myMatch.test('http://google.com/?ccc=ddd&aaa=bbb'); // true
```

#### Strict mode for params

You can activate strict mode for checking params by prepending exclamation mark (`!`) in front of params pattern:

```javascript
myMatch = new UrlMatch('*://*/*?!aaa=*');
```

In strict mode, all param patterns must be matched and there can be no unmatched params:

```javascript
myMatch.test('http://google.com/?aaa=bbb'); // true
myMatch.test('http://google.com/'); // false (param missing)
myMatch.test('http://google.com/?aaa=bbb&ccc=ddd'); // false (too many params)
```

### Match URL fragments

NOTE: This functionality is not available in Chrome pattern matching.

You can check for URL fragments (the part of the URL after `#`):

```javascript
myMatch = new UrlMatch('*://*/*#aaa');
myMatch.test('http://google.com/#aaa'); // true
myMatch.test('http://google.com/#bbb'); // false
```

You can check for URL fragments using wildcards:

```javascript
myMatch = new UrlMatch('*://*/*#aaa*');
myMatch.test('http://google.com/#aaa'); // true
myMatch.test('http://google.com/#aaabbb'); // true
```

### Debug

You can use `debug()` method to get detailed information about matching of each part of the pattern against each tested URL.

Use it the same way you would use `test()` method. But instead of boolean value, it returns object where keys are tested URLs and values are deconstructed results.

```javascript
myMatch = new UrlMatch('*://aaa.bbb/');
myMatch.debug('http://aaa.bbb/');
/*
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
 */
```

## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue at GitHub](https://github.com/fczbkk/UrlMatch/issues) or send me an e-mail at <a href="mailto:riki@fczbkk.com">riki@fczbkk.com</a>.

## License

UrlMatch is published under the [MIT license](https://github.com/fczbkk/UrlMatch/blob/master/LICENSE).
