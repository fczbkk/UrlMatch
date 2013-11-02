UrlMatch
========

JavaScript object that provides URL matching functionality using patterns similar to what is used in extensions in Google Chrome:
http://developer.chrome.com/extensions/match_patterns.html

It should work fine in any browser. It has no external dependencies.

How to use
----------

In it's most simple form, you can use it as a generic URL validator. 

```javascript
myMatch = new UrlMatch('*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('https://www.google.com/preferences?hl=en'); // true
myMatch.test('this.is.not/valid.url'); // false
```

But what you usually want to do is to match it against some specific URL pattern.

```javascript
myMatch = new UrlMatch('*://*.google.com/*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://calendar.google.com/'); // true
myMatch.test('https://www.google.com/preferences?hl=en'); // true
myMatch.test('http://www.facebook.com/'); // false
myMatch.test('http://www.google.sucks.com/'); // false
```

You can use it to match against a list of patterns.

```javascript
myMatch = new UrlMatch('*://*.google.com/*', '*://*.facebook.com/*');
myMatch.test('http://www.google.com/'); // true
myMatch.test('http://www.facebook.com/'); // true
myMatch.test('http://www.apple.com/'); // false
```

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

Bug reports, feature requests and contact
-----------------------------------------

If you found any bugs, if you have feature requests or any questions, please, either [file an issue at GitHub][1] or send me an e-mail at [riki@fczbkk.com][2]

License
-------

UrlMatch is published under the [UNLICENSE license][3]. Feel free to use it in any way.


  [1]: https://github.com/fczbkk/UrlMatch/issues
  [2]: mailto:riki@fczbkk.com?subject=UrlMatch
  [3]: https://github.com/fczbkk/UrlMatch/blob/master/UNLICENSE