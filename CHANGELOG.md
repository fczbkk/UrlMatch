# [3.6.0](https://github.com/fczbkk/UrlMatch/compare/v3.5.0...v3.6.0) (2026-01-08)


### Bug Fixes

* better escaping of special characters in some Host and Path patterns ([21b0c5e](https://github.com/fczbkk/UrlMatch/commit/21b0c5eecf22b4b6d2f8d9f3b69cfc74baefaf06))
* rename vitest config to .mjs for CI compatibility ([aee59cb](https://github.com/fczbkk/UrlMatch/commit/aee59cbdba60cec214556ea112684c45c686b628))


### Features

* add ESM support with backward-compatible CJS ([49f1cb2](https://github.com/fczbkk/UrlMatch/commit/49f1cb27de4c719d8074480f726b7075ed01a6b1))
* migrate to TypeScript ([16dee92](https://github.com/fczbkk/UrlMatch/commit/16dee92a5d3d64d2e268c26da2874794c178ad39))


### Performance Improvements

* cache Pattern objects to avoid repeated instantiation ([083a717](https://github.com/fczbkk/UrlMatch/commit/083a7174e24148873a05fa3c5abcaa2286339233))
* pre-compile RegExp patterns in Params class ([f65315b](https://github.com/fczbkk/UrlMatch/commit/f65315baf0c2ec5fe17fa65f1c5f8bdbe9a82a55))
* replace forEach with for...of and extract array literal to constant ([23e0318](https://github.com/fczbkk/UrlMatch/commit/23e031800e7059cb70b81b98635704917485c047))
* replace forEach with for...of loops to enable early exit ([4546d53](https://github.com/fczbkk/UrlMatch/commit/4546d532d48d9e843a6bbb14d40b56aca0c0d4eb))
* use Set for pattern deduplication instead of indexOf ([8e56bd4](https://github.com/fczbkk/UrlMatch/commit/8e56bd4cf8debd366c0f4a8a3eac88fd99171288))



<a name="3.5.0"></a>
# [3.5.0](https://github.com/fczbkk/UrlMatch/compare/v3.4.0...v3.5.0) (2023-05-07)


### Features

* add type definitions ([9578d07](https://github.com/fczbkk/UrlMatch/commit/9578d07))



<a name="3.4.0"></a>
# [3.4.0](https://github.com/fczbkk/UrlMatch/compare/v3.3.5...v3.4.0) (2023-04-06)


### Features

* allow to use plus sign in path ([e545f1d](https://github.com/fczbkk/UrlMatch/commit/e545f1d)), closes [#6](https://github.com/fczbkk/UrlMatch/issues/6)



<a name="3.3.5"></a>
## [3.3.5](https://github.com/fczbkk/UrlMatch/compare/v3.3.4...v3.3.5) (2018-04-28)


### Bug Fixes

* allow underscores in domain names ([94c33ca](https://github.com/fczbkk/UrlMatch/commit/94c33ca))



<a name="3.3.4"></a>
## [3.3.4](https://github.com/fczbkk/UrlMatch/compare/v3.3.3...v3.3.4) (2018-02-08)


### Bug Fixes

* match pattern with strictly no params ([4a9ecd0](https://github.com/fczbkk/UrlMatch/commit/4a9ecd0))



<a name="3.3.3"></a>
## [3.3.3](https://github.com/fczbkk/UrlMatch/compare/v3.3.2...v3.3.3) (2017-10-17)


### Bug Fixes

* escape brackets in path pattern ([d060c1a](https://github.com/fczbkk/UrlMatch/commit/d060c1a))



<a name="3.3.2"></a>
## [3.3.2](https://github.com/fczbkk/UrlMatch/compare/v3.3.1...v3.3.2) (2017-10-07)


### Bug Fixes

* add valid separator characters to the path part ([05e8e71](https://github.com/fczbkk/UrlMatch/commit/05e8e71))



<a name="3.3.1"></a>
## [3.3.1](https://github.com/fczbkk/UrlMatch/compare/v3.3.0...v3.3.1) (2017-03-17)


### Bug Fixes

* correctly match patterns containing "@" character([cb3b3fa](https://github.com/fczbkk/UrlMatch/commit/cb3b3fa))



<a name="3.3.0"></a>
# [3.3.0](https://github.com/fczbkk/UrlMatch/compare/v3.2.1...v3.3.0) (2016-10-17)


### Features

* add `debug()` method([00f1da9](https://github.com/fczbkk/UrlMatch/commit/00f1da9))



<a name="3.2.1"></a>
## [3.2.1](https://github.com/fczbkk/UrlMatch/compare/v3.2.0...v3.2.1) (2016-07-28)


### Bug Fixes

* match patterns containing special characters in fragment([4c8b5a1](https://github.com/fczbkk/UrlMatch/commit/4c8b5a1))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/fczbkk/UrlMatch/compare/v3.1.0...v3.2.0) (2016-07-17)


### Bug Fixes

* revert recent changes([432b5fe](https://github.com/fczbkk/UrlMatch/commit/432b5fe))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/fczbkk/UrlMatch/compare/v3.0.0...v3.1.0) (2016-07-17)


### Bug Fixes

* assume path always ends with optional trailing slash if missing([0662e33](https://github.com/fczbkk/UrlMatch/commit/0662e33))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/fczbkk/UrlMatch/compare/v2.2.0...v3.0.0) (2016-05-31)



<a name="2.2.0"></a>
# [2.2.0](https://github.com/fczbkk/UrlMatch/compare/v2.1.2...v2.2.0) (2016-05-13)


### Features

* add compatibility with PrototypeJS v1.6 and lower([867bc62](https://github.com/fczbkk/UrlMatch/commit/867bc62))



<a name="2.1.2"></a>
## [2.1.2](https://github.com/fczbkk/UrlMatch/compare/v2.1.1...v2.1.2) (2016-05-06)


### Bug Fixes

* do not throw an error in strict Param mode when params are missing([2d62d77](https://github.com/fczbkk/UrlMatch/commit/2d62d77))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/fczbkk/UrlMatch/compare/v2.1.0...v2.1.1) (2016-05-06)


### Bug Fixes

* properly remember whether Params should be in strict mode([04f45e7](https://github.com/fczbkk/UrlMatch/commit/04f45e7))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/fczbkk/UrlMatch/compare/v2.0.0...v2.1.0) (2016-05-05)


### Features

* add compatibility with IE11-([322f16f](https://github.com/fczbkk/UrlMatch/commit/322f16f))
* add strict mode for params([d2ffa4e](https://github.com/fczbkk/UrlMatch/commit/d2ffa4e)), closes [#1](https://github.com/fczbkk/UrlMatch/issues/1)



<a name="2.0.0"></a>
# 2.0.0 (2016-05-01)



