const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上面的斜杠

/**
 * middleware loader
 * @param {Object} app Koa 实例 
 * 
 * 加载所有 middleware，可通过 `app.middleware.${目录}.${文件}` 访问
 * 
 * 例子：
 * app/middleware
 *   |
 *   |-- custom-module
 *           |
 *           |-- custom-middleware.js
 * 
 * => app.middleware.customModule.customMiddleware
 * 
 */
module.exports = (app) => {
  // 读取 app/middleware/**/**.js 下所有的文件
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);
  const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}**.js`));

  // 遍历所有文件目录，把内容加载到 app.middleware 上
  const middlewares = {};
  fileList.forEach(file =>{
    // 提出文件名称
    let name = path.resolve(file);

    // 截取路径 app/middleware/custom-module/custom-middleware.js => custom-module/custom-middleware
    name = name.substring(name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length, name.lastIndexOf('.'));

    // 把 '-' 统一改成驼峰 custom-module/custom-middleware => customModule/customMiddleware
    name = name.replace(/[_-][a-z]/ig, (s) =>s.substring(1).toUpperCase());

    // 挂载 middlewares 到内存 app 对象上
    let tempMiddleware = middlewares;
    const names = name.split(sep);
    for(let i = 0, len = names.length; i < len; i++){
      const n = names[i];
      if(i === len - 1){
        tempMiddleware[n] = require(path.resolve(file))(app);
      }else{
        if(!tempMiddleware[n]){
          tempMiddleware[n] = {};
        }
        tempMiddleware = tempMiddleware[n];
      }
    }
  })
  app.middlewares = middlewares;
}