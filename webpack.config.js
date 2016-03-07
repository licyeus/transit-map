var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: __dirname + '/client',
  entry: {
    javascript: './app.js'
  },

  output: {
    filename: 'app.js',
    path: __dirname + '/dist',
    publicPath: '/dist/'
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(html|png)$/, loader: 'file?name=[name].[ext]j' },
      { test: /\.css$/, loader: 'style!css' }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      devServer: 'http://localhost:8080/dist',
      template: './index.ejs',
      title: 'Transit Map',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ]
}