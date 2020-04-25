const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    // 入口js文件的位置
    entry: ["@babel/polyfill", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: "bundle.js",
        // publicPath: "/dist/"		// 在浏览器地址中输入的
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
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
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    // {
                    //     loader: MiniCssExtractPlugin.loader
                    // },
                    /**/{
                        loader: 'style-loader',
                        options: { attributes: { class: 'webpack-style' } }
                    }  ,//*/ 
                    {
                        loader: 'css-loader',
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
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    interpolate: true
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot|otf|svg)$/,
                use: [
                    {
                        loader: 'file-loader?name=./font/[name].[ext]'
                        // loader: 'url-loader',
                        // options: {
                        //     fallback: require.resolve('file-loader'),
                        // }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true
        }),
		//  静态资源的设置
        new CopyPlugin([
            {
                from: './src/static/plugins',	// 相对于项目根目录
                to: 'plugins/'
                // flatten: true
            },
            {
                from: './src/static/style',	// 相对于项目根目录
                to: 'style/'
            }
        ]),
        new VueLoaderPlugin()
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
        })],
        splitChunks: {
            chunks: 'all',
        }
    },
    devServer: {
        // contentBase: path.resolve('../src/static'),
        // compress: true,
        // port: 8080,
        disableHostCheck: true
    },
    // 定义变量
    resolve: {
        extensions: ['.js'],
        alias: {
            '~': path.resolve(__dirname, '../src/')	// 将~ 定义为项目根目录
        }
    }
}
