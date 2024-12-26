const path = require('path');
const merge = require('webpack-merge');
const os = require('os'); // 多线程需要
const HappyPack = require('happypack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

// 多线程 build 设置
const happypackCommonConfig = {
  debug: false,
  threadPool: HappyPack.ThreadPool({ size: os.cpus().length }), // 线程池
}

// 基类配置
const baseConfig = require('./webpack.base.js');

// 生产环境 webpack 配置
const webpackProdConfig = merge.smart(baseConfig, {
  // 指定生产环境
  mode: 'production',
  // 生产环境的 output 配置
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.join(process.cwd(), './app/public/dist/prod'), // TODO: 后续开发环境与生产环境不一致，产物不落地
    publicPath: '/dist/prod',
    crossOriginLoading: 'anonymous',
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'happyPack/loader?id=css',
      ]
    },{
      test: /\.js$/,
      include:[
        // 只对业务代码进行 babel 编译，加快webpack打包速度
        path.resolve(process.cwd(), './app/pages')
      ],
      use: [
        'happyPack/loader?id=js'
      ]
    }]
  },
  // webpack 不会产生大量 hints 信息，默认为warning
  performance: {
    hints: false
  },
  plugins: [
    // 每次 build 前清空 public/dist 目录
    new CleanWebpackPlugin(['public/dist'],{
      root: path.resolve(process.cwd(), './app/'),
      exclude: [],
      verbose: true,
      dry: false
    }),
    // 提取公共 css 有效利用缓存，非公共部分使用 inline
    new MiniCssExtractPlugin({
      chunkFilename: 'css/[name]_[contenthash:8].bundle.css'
    }),
    // 优化并压缩 css 资源
    new CSSMinimizerPlugin(),
    // 多线程打包 JS 加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: 'js',
      loaders: [`babel-loader?${JSON.stringify({
        presets: ['@babel/preset-env'],
        plugins: [
          '@babel/plugin-transform-runtime',
        ]
      })}`]
    }),
    // 多线程打包 CSS 加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: 'css',
      loaders: [{
        path: 'css-loader',
        options: {
          importLoaders: 1
        }
      }]
    }),
    // 非必要 浏览器在请求资源时不发送用户身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: 'anonymous'
    })
  ],
  optimization: {
    // 使用 TerserWebpackPlugin 的并发和缓存，提升压缩阶段的性能
    // 清除 console.log
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        cache: true, // 启用缓存来加速构建过程
        parallel: true, // 利用多核 CPU 的优势来加速压缩
        terserOptions: {
          compress: {
            drop_console: true // 删除所有的 console.*
          }
        }
      })
    ],
  }
})

module.exports = webpackProdConfig;