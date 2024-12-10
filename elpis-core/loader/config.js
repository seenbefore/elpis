const path = require('path');
const { sep } = path; // 兼容不同操作系统上面的斜杠

/**
 * config loader
 * @param {object} app koa实例
 * 
 * 配置区分 本地/测试/生产，通过 env 环境去读取不同文件配置 env.config
 * 通过 env.config 去覆盖 default.config 加载到app.config上
 * 
 * 目录下对应的 config 配置
 * 默认配置 config/config.default.js
 * 本地配置 config/config.local.js
 * 测试配置 config/config.beta.js
 * 生产配置 config/config.prod.js
 * 
 */
module.exports = (app) => {
  // 找到 config 目录
  const configPath = path.resolve(app.baseDir, `.${sep}config`);

  // 获取 default.config
  let defaultConfig = {};
  try {
    defaultConfig = require(path.resolve(configPath, `.${sep}config.default.js`));
  } catch (e) {
    console.error('[exception] default.config file not found');
  }

  // 获取 env.config
  let envConfig = {};
  try {
    if(app.env.isLocal()){ // 本地环境
      envConfig = require(path.resolve(configPath, `.${sep}config.local.js`));
    } else if(app.env.isBeta()){ // 测试环境
      envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`));
    } else if(app.env.isProduction()){ // 生产环境
      envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`));        
    }
  } catch (e) {
    console.error('Error loading config:', e);
  }
  
  // 覆盖并加载到 app.config 上
  app.config = Object.assign({}, defaultConfig, envConfig);
}