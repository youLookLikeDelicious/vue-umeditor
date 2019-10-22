const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    // 入口js文件的位置
    entry: "./src/index.js",
    output: {
        path: '/dist/',
        filename: "bundle.js",
        // publicPath: "/dist/"		// 在浏览器地址中输入的
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.scss$|.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader?name=./img/[name].[ext]'
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader?name=./font/[name].[ext]'
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true
        }),
        // HTML模板的相关设置
        new HtmlWebpackPlugin({
            title: 'Vue-umeditor',
            template: './dist/index.html',
            filename: 'index.html'
        }),
		//  静态资源的设置
        new CopyPlugin([
            {
                from: './src/static/plugins',	// 相对于项目根目录
                to: 'plugins/'
                // flatten: true
            }
        ]),
    ],
    optimization: {
        // 压缩js文件的相关设置
        minimizer: [new UglifyJsPlugin({
            uglifyOptions: {
                ie8: false,
                output: {
                    comments: false,
                    beautify: false
                },
                compress: true,
                warning: false
            }
        })]
    },
    devServer: {
        contentBase: path.resolve('../src/static'),
        // compress: true,
        // port: 8080
    },
    // 定义变量
    resolve: {
        extensions: ['.js'],
        alias: {
            '~': path.resolve(__dirname, '../src/')	// 将~ 定义为项目根目录
        }
    }
}
