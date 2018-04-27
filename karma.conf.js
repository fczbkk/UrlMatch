const webpack_config = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: ['test/**/*.spec.js'],
    preprocessors: {'test/**/*.spec.js': ['webpack']},
    webpack: {
      mode: 'development',
      module: webpack_config.module
    },
    webpackMiddleware: {noInfo: true},
    reporters: ['coverage', 'mocha'],
    mochaReporter: {output: 'minimal'},
    coverageReporter: {
      type: 'html',
      dir: 'temp/coverage'
    },
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};
