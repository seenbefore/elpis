const glob = require('glob');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 动态构造 pageEntry 和 htmlWebpackPluginList
const pageEntry = {};
const htmlWebpackPluginList = [];
// 获取所有入口文件，约定 app/pages 目录下所有的 entry.xxx.js
const entryList = path.resolve(process.cwd(), './app/pages/**/entry.*.js');
glob.sync(entryList).forEach(file => {
  const entryName = path.basename(file, '.js');
  // 构造 entry
  pageEntry[entryName] = file;
  // 构造 HtmlWebpackPlugin 即最终渲染的页面文件
  htmlWebpackPluginList.push(
    new HtmlWebpackPlugin({
      // 产物（最终模版）输出路径
      filename: path.resolve(process.cwd(), './app/public/dist/', `${entryName}.tpl`),
      // 指定要使用的模版文件
      template: path.resolve(process.cwd(), './app/view/entry.tpl'),
      // 要注入的代码块
      chunks: [entryName],
    })
  );
});
/**
 * webpack基础配置
 */
module.exports = {
  // 入口配置
  entry: pageEntry,
  // 模块解析配置（决定了要加载解析哪些模块，以及用什么方式去解释）
  module: {
    rules: [{
      test: /\.vue$/,
      use: 'vue-loader'
    },{
      test: /\.js$/,
      include:[
        // 只对业务代码进行 babel 编译，加快webpack打包速度
        path.resolve(process.cwd(), './app/pages')
      ],
      use: 'babel-loader'
    },{
      test: /\.(png|jpe?g|gif)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 300,
          esModule: false,
        }
      }]
    },{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },{
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    },{
      test: /\.(eot|svg|ttf|otf|woff|woff2)(\?.*)?$/,
      use: 'file-loader'
    }]
  },
  // 产物输出路径,因为开发和生产环境输出不一致，所以在各自环境中自行配置
  output: {},
  // 配置模块解析的具体行为（定义webpack在打包时，如何找到并解析具体模块的路径）
  resolve: {
    extensions: ['.js', '.vue', '.less', '.css'],
    alias: {
      $pages: path.resolve(process.cwd(), './app/pages'),
      $common: path.resolve(process.cwd(), './app/pages/common'),
      $widgets: path.resolve(process.cwd(), './app/pages/widgets'),
      $store: path.resolve(process.cwd(), './app/pages/store'),
    }
  },
  // 配置webpack插件
  plugins: [
    // 处理.vue文件，这个插件是必须的
    // 它的作用是将你定义的其他规则复制并且应用到 .vue 文件里
    // 例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块
    new VueLoaderPlugin(),
    // 把第三方库暴露到 windows context 下
    new webpack.ProvidePlugin({
      Vue: 'vue',
    }),
    // 定义全局变量
    new webpack.DefinePlugin({
      _VUE_OPTIONS_API_: 'true', // 支持 vue 解析 options api
      _VUE_PROD_DEVTOOLS_: 'false', // 禁用 Vue Devtools
      _VUE_PROD_HYDRATION_MISMATCH_DETAILS_: 'false', // 禁用生产环境显示水合信息
    }),
    // 构造最终渲染的页面 root 到底在哪里
    ...htmlWebpackPluginList,
  ],
  // 配置打包输出优化（配置代码分割，模块合并，缓存，TreeSharing，压缩等优化策略）
  optimization: {
    /**
     * 把 js 文件打包成3种类型
     * 1. vendor：第三方 lib 库，基本不会改动，除非依赖版本升级
     * 2. common：业务组件代码的公共部分抽取出来，改动较小
     * 3. entry.{page}：不同页面 entry 里的业务组件代码差异部分，会经常改动
     * 目的：把改动和引用频率不一样的 js 区分出来，以达到更好地利用浏览器缓存的效果
     */
    splitChunks:{
      chunks: 'all', // 对同步和异步的模块都进行分割
      maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
      maxInitialRequests: 10, // 入口点的最大并行请求数
      cacheGroups: {
        vendor: { // 第三方库
          name: 'vendor', // 模块名称
          test: /[\\/]node_modules[\\/]/, // 匹配规则 打包 node_modules 下的文件
          priority: 20, // 优先级, 越大优先级越高
          enforce: true, // 强制执行
          reuseExistingChunk: true, // 复用已经存在的公共 chunk
        },
        common: { // 公共模块
          name: 'common', // 模块名称
          minChunks: 2, // 被两处引用即被归为公共模块
          minSize:1, // 最小分割文件大小 教学效果（1kb）
          priority: 10, // 优先级
          reuseExistingChunk: true, // 复用已经存在的公共 chunk
        },
      }
    },
    // 将 webpack 运行时生成的代码打包到 runtime.js 中
    runtimeChunk: true,
  },
}