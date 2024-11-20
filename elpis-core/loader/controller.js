const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上面的斜杠

/**
 * controller loader
 * @param {Object} app Koa 实例 
 * 
 * 加载所有 controller，可通过 `app.controller.${目录}.${文件}` 访问
 * 
 * 例子：
 * app/controller
 *   |
 *   |-- custom-module
 *           |
 *           |-- custom-controller.js
 * 
 * => app.controller.customModule.customController
 * 
 */
module.exports = (app) => {
  // 读取 app/controller/**/**.js 下所有的文件
  const controllerPath = path.resolve(app.businessPath, `.${sep}controller`);
  const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}**.js`));

  // 遍历所有文件目录，把内容加载到 app.controller 上
  const controller = {};
  fileList.forEach(file =>{
    // 提出文件名称
    let name = path.resolve(file);

    // 截取路径 app/controller/custom-module/custom-controller.js => custom-module/custom-controller
    name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf('.'));

    // 把 '-' 统一改成驼峰 custom-module/custom-controller => customModule/customController
    name = name.replace(/[_-][a-z]/ig, (s) =>s.substring(1).toUpperCase());

    // 挂载 controller 到内存 app 对象上
    let tempController = controller;
    const names = name.split(sep); // [customModule(目录),customController(文件)]
    for(let i = 0, len = names.length; i < len; i++){
      const n = names[i];
      if(i === len - 1){ // 文件
        const ControllerModule = require(path.resolve(file))(app);
        tempController[n] = new ControllerModule();
      }else{ // 目录
        if(!tempController[n]){
          tempController[n] = {};
        }
        tempController = tempController[n];
      }
    }
  })
  app.controller = controller;
}