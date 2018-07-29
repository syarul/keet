const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  target: 'web',
  node: {
    fs: 'empty'
  },
  entry: [
    './examples/counter.js',
    './view/layout.pug'
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.pug$/,
        use: ['html-loader', 'pug-html-loader?pretty&exports=false']
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.js', '.styl'],
    alias: {
      components: path.resolve(__dirname, './components'),
      keet: path.resolve(__dirname, './keet'),
      '@keet/classList': path.resolve(__dirname, './classList')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'index.html',
      favicon: 'favicon.ico',
      template: path.join('view', 'layout.pug')
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  devServer: {
    hot: true,
    inline: true
  },
  devtool: '#eval-source-map'
}

module.exports = config
