const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上面的斜杠

/**
 * extend loader
 * @param {Object} app Koa 实例 
 * 
 * 加载所有 extend，可通过 `app.extend.${文件}` 访问
 * 
 * 例子：
 * app/extend
 *   |
 *   |-- custom-extend.js
 * 
 * => app.extend.customExtend
 * 
 */
module.exports = (app) => {
  // 读取 app/extend/**.js 下所有的文件
  const extendPath = path.resolve(app.businessPath, `.${sep}extend`);
  const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}**.js`));

  // 遍历所有文件目录，把内容加载到 app.extend 上
  fileList.forEach(file =>{
    // 提出文件名称
    let name = path.resolve(file);

    // 截取路径 app/extend/custom-extend.js => custom-extend
    name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf('.'));

    // 把 '-' 统一改成驼峰 custom-extend => customExtend
    name = name.replace(/[_-][a-z]/ig, (s) =>s.substring(1).toUpperCase());

    // 过滤 app 已经存在的 key
    for(const key in app){
      if(key === name){
        console.log(`[extend load error] name:${name} is already in app`)
        return;
      }
    }

    // 挂载 extend 到内存 app 对象上
    app[name] = require(path.resolve(file))(app);
  })
}