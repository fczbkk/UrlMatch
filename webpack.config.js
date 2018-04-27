const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'url-match.js',
    path: path.resolve(__dirname, 'docs'),
    library: 'UrlMatch',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      }
    ]
  }
};
