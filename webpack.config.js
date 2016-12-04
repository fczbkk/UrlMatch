module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'url-match.js',
    path: './docs/',
    library: 'UrlMatch',
    libraryTarget: 'var'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      }
    ]
  }
};
