// 打包资源
const path = require('path')
const createVueLoaderOptions = require('./vue-loader.config.js')

const isDev = process.env.NODE_ENV === 'development' //判断是否开发环境
console.log(process.env.NODE_ENV)
const config = {
    target: 'web', // 编译目标
    mode: process.env.NODE_ENV, // webpack 4.0 新增mode属性
    entry: path.join(__dirname, '../src/index.js'),
    performance: {
        hints: isDev ? false : 'warning'
    }, // 控制大小提示
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: createVueLoaderOptions(isDev)
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/ // 忽略文件
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024, // 文件大小
                            name: 'static/img/[path][name]-[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    }
}


module.exports = config