module.exports = (isDev) => {
    return {
        preserveWhitepace: true, // 清除文本换行等情况空格
        extractCss: true, // 把vue的css提取到单独的文件，默认
    }
}