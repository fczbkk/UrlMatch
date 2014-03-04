# UrlMatch

JavaScript object that provides URL matching functionality using patterns similar to what is used in extensions in Google Chrome:
http://developer.chrome.com/extensions/match_patterns.html

On top of Chrome's pattern matching, this object can also check for specific URL parameters and fragments (see below).

## Browser compatibility

It should work fine in any modern browser. It has no external dependencies.

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
myMatch = new UrlMatch('*://*/*#aaa***');
myMatch.test('http://google.com/#aaa'); // true
myMatch.test('http://google.com/#aaabbb'); // true
```

## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue at GitHub][1] or send me an e-mail at [riki@fczbkk.com][2]

## License

UrlMatch is published under the [UNLICENSE license][3]. Feel free to use it in any way.


  [1]: https://github.com/fczbkk/UrlMatch/issues
  [2]: mailto:riki@fczbkk.com?subject=UrlMatch
  [3]: https://github.com/fczbkk/UrlMatch/blob/master/UNLICENSE