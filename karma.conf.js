module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: ['test/**/*.spec.js'],
    preprocessors: {'test/**/*.spec.js': ['webpack']},
    webpack: webpack_config,
    webpackMiddleware: {noInfo: true},
    reporters: ['coverage', 'mocha'],
    mochaReporter: {output: 'minimal'},
    coverageReporter: {
      type: 'html',
      dir: 'temp/coverage'
    },
    browsers: ['PhantomJS'],
    singleRun: true
  });
};

var webpack_config = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      }
    ]
  }
};
