// 打包资源
const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin') // loader 15版本要加
const webpack = require('webpack')
// const ExtractPlugin = require('extract-text-webpack-plugin') // 打包css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development' //判断是否开发环境
console.log(process.env.NODE_ENV)
const config = {
    target: 'web', // 编译目标
    mode: process.env.NODE_ENV, // webpack 4.0 新增mode属性
    entry: path.join(__dirname, 'src/index.js'),
    performance: {
        hints: isDev ? false : 'warning'
    }, // 控制大小提示
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024, // 文件大小
                            name: 'static/img/[name]-aaa.[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [ // loader15版本要加
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"' // 加双引号
                // NODE_ENV: '"production"'
            } // 区分开发环境和正式环境
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin()
    ]
}
if (isDev) {
    config.module.rules.push({
        test: /\.styl(us)?$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    })
    config.devtool = '#cheap-module-eval-source-map' // 映射代码
    config.devServer = {
        port: 8085,
        host: '0.0.0.0', // ip比localhost方便
        overlay: {
            errors: true // 反应错误到页面上
        },
        // open: true, // 自动打开页面
        hot: true, // 局部刷新
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    config.entry = {
        app: path.join(__dirname, '../src/index.js'),
        vendor: ['vue']
    }
    config.output.filename = 'static/js/[name].[chunkHash:8].js'
    config.module.rules.push({
        test: /\.styl(us)?$/,
        // use: ExtractPlugin.extract({
        //     fallback: 'style-loader',
        //     use: [
        //         'css-loader',
        //         {
        //             loader: 'postcss-loader',
        //             options: {
        //                 sourceMap: true
        //             }
        //         },
        //         'stylus-loader'
        //     ]
        // })
        use: [
            MiniCssExtractPlugin.loader,
            // 'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    })
    config.plugins.push(
        // new ExtractPlugin('css/styles.[hash:8].css'),
        new MiniCssExtractPlugin({
        　　filename: "static/css/[name].[chunkhash:8].css"
        // 　　chunkFilename: "[id].css"
    　　})
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor'
        // }) // 分离js文件
    )
    config.optimization = { // 分离js文件
        splitChunks: {
            chunks: 'async',
            // 大于30KB才单独分离成chunk
            minSize: 30000,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendors: {
                    chunks: 'initial',
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: "all"
                },
                echarts: {
                    name: 'echarts',
                    chunks: 'all',
                    // 对echarts进行单独优化，优先级较高
                    priority: 20,
                    test: function(module) {
                        var context = module.context;
                        return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)
                    }
                }
            }
        },
        runtimeChunk: true
    }
}

module.exports = config