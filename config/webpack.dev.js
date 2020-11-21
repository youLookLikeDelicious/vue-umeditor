const merge   = require('webpack-merge')
const common  = require('./webpack.common.js')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  entry: "./dev/index.js",
  mode: 'development',
  devServer: {
    hot: true,
    port: 8088
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // HTML模板的相关设置
    new HtmlWebpackPlugin({
      title: 'Vue-umeditor',
      template: './dev/index.html',
      filename: 'index.html'
    })
  ]
})