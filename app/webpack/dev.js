// 本地开发启动 devServer
const express = require('express');
const path = require('path');
const consoler = require('consoler');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

// 引入开发环境 webpack 配置和 devServer 配置
const {
  webpackDevConfig,
  DEV_SERVER_CONFIG
} = require('./config/webpack.dev.js');

const app = express();

const compiler = webpack(webpackDevConfig);

// 指定静态资源目录
app.use(express.static(path.join(__dirname, '../public/dev')));

// 引用 devMiddleware 中间件（监控文件改动）
app.use(devMiddleware(compiler, {
  // 落地文件
  writeToDisk:(filePath) => filePath.endsWith('.tpl'),
  // 资源路径
  publicPath: webpackDevConfig.output.publicPath,
  // headers 配置 健壮性考虑 跨域
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  },
  // 日志配置有颜色
  stats: {
    colors: true
  }
}));

// 引用 hotMiddleware 中间件（实现热更新通讯）
app.use(hotMiddleware(compiler, {
  path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
  log: () => {}
}));

consoler.info('请等待 webpack 初次构建完成提示......')

// 启动 devServer
const port = DEV_SERVER_CONFIG.PORT;
app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
})
