var path = require('path')

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'oidc.rp.min.js',
    library: 'OIDC',
    libraryTarget: 'var'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  externals: {
    'node-fetch': 'fetch',
    'text-encoding': 'TextEncoder',
    'whatwg-url': 'window',
    '@trust/webcrypto': 'crypto'
  },
  devtool: 'source-map'
}
