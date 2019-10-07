  const path = require('path')
  const {CleanWebpackPlugin} = require('clean-webpack-plugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
  
module.exports = {
	// 入口js文件的位置
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "public"),
		filename: "bundle.js"
	},
	module: {
		rules: [
		{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: "babel-loader",
				options: {
					presets: ["babel-preset-env"]
				}
			}
        }
       ]
   },
   plugins: [
     new CleanWebpackPlugin({
		 cleanStaleWebpackAssets: true
	 }),
	 // HTML模板的相关设置
     new HtmlWebpackPlugin({
        title: 'Animate',
 		template: './src/index.html',
		filename: 'index.html'
     })
   ],
   optimization: {
	// 压缩js文件的相关设置 
    minimizer: [new UglifyJsPlugin({
		uglifyOptions: {
			ie8: false,
			output:{
				comments: false,
				beautify: false
			},
			compress: true,
			warning: false
		}
	})]
  },
}