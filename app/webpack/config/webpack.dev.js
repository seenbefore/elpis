const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

// 基类配置
const baseConfig = require('./webpack.base.js');

// dev-server 配置
const DEV_SERVER_CONFIG = {
  HOST: '127.0.0.1',
  PORT: 9002,
  HMR_PATH: '__webpack_hmr',
  TIMEOUT: 20000
};

// 开发阶段的 entry 配置需要加入 HMR
Object.keys(baseConfig.entry).forEach(v =>{
  // 第三方包不作为 HMR 的入口
  if(v !== 'vendor'){
    baseConfig.entry[v] = [
      // 主入口文件
      baseConfig.entry[v],
      // HMR 更新入口，官方指定的 HMR 路径
      `webpack-hot-middleware/client?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`,
    ];
  }
})

// 开发环境 webpack 配置
const webpackDevConfig = merge.smart(baseConfig, {
  // 指定开发环境
  mode: 'development',
  // 开发环境的 source-map 配置，呈现代码的映射关系，方便调试代码
  devtool: 'eval-cheap-module-source-map',
  // 开发环境的 output 配置
  output: {
    filename: 'js/[name]_[chunkhas:8].bundle.js',
    path: path.resolve(process.cwd(), './app/public/dist/dev/'), // 输出文件存储路径
    publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`, // 外部资源公共路径
    globalObject: 'this' // 健壮性，支持多环境打包
  },
  // 开发阶段插件
  plugins: [
    // 热更新插件 HotModuleReplacementPlugin 
    // 用于在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面
    // 极大提高开发效率
    new webpack.HotModuleReplacementPlugin({
      multiStep: false,
    }),
  ],
})

module.exports = {
  // webpack 配置
  webpackDevConfig,
  // devServer 配置，暴露给 dev.js 使用
  DEV_SERVER_CONFIG
};