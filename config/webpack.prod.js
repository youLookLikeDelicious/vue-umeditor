const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // new CompressionPlugin({
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$|\.html$/,
    // }),
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
      analyzerMode: 'static'
    }),
  ]
})