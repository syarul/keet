const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = {
  target: 'web',
  node: {
    fs: 'empty'
  },
  entry: './keet',
  output: {
    path: path.resolve(__dirname),
    filename: 'keet-min.js',
    library: 'Keet',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: [/node_modules/, /keet/, /test/],
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.js'],
    alias: {
      components: path.resolve(__dirname, './components'),
      keet: path.resolve(__dirname, './keet')
    }
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new UglifyJSPlugin({
        uglifyOptions: {
        ie8: false,
        ecma: 8,
        mangle: true,
        output: {
          comments: false,
          beautify: false
        },
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        },
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
}

module.exports = config