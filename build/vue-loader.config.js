// const docsLoader = require.resolve('./doc-loader')
console.log(556)
module.exports = (isDev) => {
    return {
        preserveWhitepace: true, // 清除文本换行等情况空格
        extractCss: !isDev, // 把vue的css提取到单独的文件，默认
        cssModules: {},
        // hotReload: false, // 根据环境变量生成
        // loaders: {
        //     'docs': docsLoader
        // },
        // preLoader: {},
        // postLoader: {},
    }
}