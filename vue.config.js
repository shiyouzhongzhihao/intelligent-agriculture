const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
// vue.config.js
// vue.config.js
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0', // ✅ 修正为监听所有接口（或使用实际IP）
    proxy: {
      '/api': {
        target: 'http://172.20.10.12:3000', // 保持后端真实IP
        // target: 'http://192.168.241.46:3000', // 注释
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        ws: true
      }
    }
  }
})
