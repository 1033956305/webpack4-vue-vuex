// 打包资源
const path = require('path')
const HTMLPlugin = require('html-webpack-plugin') // 生成html入口文件，引入外部资源
const VueLoaderPlugin = require('vue-loader/lib/plugin') // loader 15版本要加
const webpack = require('webpack')
const merge = require('webpack-merge') // 混合打包工具
// const ExtractPlugin = require('extract-text-webpack-plugin') // 打包css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development' //判断是否开发环境

const defaultPlugin = [ // 放在这边便于服务器端渲染
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: isDev ? '"development"' : '"production"' // 加双引号
            // NODE_ENV: '"production"'
        } // 区分开发环境和正式环境
    }),
    new VueLoaderPlugin(),
    new HTMLPlugin()
]

const devServer = {
    port: 8085,
    host: '0.0.0.0', // ip比localhost方便
    overlay: {
        errors: true
    },
    hot: true
}
let config
if (isDev) {
    config = merge(baseConfig, {
        devtool: '#cheap-module-eval-source-map', // 映射代码
        module: {
            rules: [
                {
                    test: /\.styl(us)?$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                localIdentName: '[path]-[name]-[hash:8].[ext]',
                                module: true
                            }
                        },
                        'stylus-loader'
                    ]
                }
            ]
        },
        devServer,
        plugins: defaultPlugin.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ])
    })
} else {
    config = merge(baseConfig, {
        entry: {
            app: path.join(__dirname, '../src/index.js'),
            vendor: ['vue']
        },
        output: {
            filename: 'static/js/[name].[chunkHash:8].js'
        },
        module: {
            rules: [
                {
                    test: /\.styl(us)?$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        'stylus-loader'
                    ]
                }
            ]
        },
        plugins: defaultPlugin.concat([
            new MiniCssExtractPlugin({
                　　filename: "static/css/[name].[chunkhash:8].css"
                // 　　chunkFilename: "[id].css"
            　　})
        ]),
        optimization: {
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
    })
}

module.exports = config