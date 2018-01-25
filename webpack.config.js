const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = {
  target: 'web',
  node: {
    fs: 'empty'
  },
  entry: [
    './examples/test2.js',
    './view/layout.pug'
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
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
      },
      {
        test: /\.pug$/,
        use:  ['html-loader', 'pug-html-loader?pretty&exports=false']
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.js', '.styl'],
    alias: {
      components: path.resolve(__dirname, './components'),
      keet: path.resolve(__dirname, './keet')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'index.html',
      template: path.join('view', 'layout.pug'),
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  devServer: {
    hot: true,
    inline: true
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  console.log('on production mode')

  delete config.devtool
  delete config.devServer

  config.entry = './keet'

  config.plugins.splice(1, 1)

  config.plugins = (config.plugins || []).concat([
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
  ])
}

module.exports = config