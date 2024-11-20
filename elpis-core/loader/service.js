const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上面的斜杠

/**
 * service loader
 * @param {Object} app Koa 实例 
 * 
 * 加载所有 service，可通过 `app.service.${目录}.${文件}` 访问
 * 
 * 例子：
 * app/service
 *   |
 *   |-- custom-module
 *           |
 *           |-- custom-service.js
 * 
 * => app.service.customModule.customService
 * 
 */
module.exports = (app) => {
  // 读取 app/service/**/**.js 下所有的文件
  const servicePath = path.resolve(app.businessPath, `.${sep}service`);
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`));

  // 遍历所有文件目录，把内容加载到 app.service 上
  const service = {};
  fileList.forEach(file =>{
    // 提出文件名称
    let name = path.resolve(file);

    // 截取路径 app/service/custom-module/custom-service.js => custom-module/custom-service
    name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf('.'));

    // 把 '-' 统一改成驼峰 custom-module/custom-service => customModule/customService
    name = name.replace(/[_-][a-z]/ig, (s) =>s.substring(1).toUpperCase());

    // 挂载 service 到内存 app 对象上
    let tempService = service;
    const names = name.split(sep); // [customModule(目录),customService(文件)]
    for(let i = 0, len = names.length; i < len; i++){
      const n = names[i];
      if(i === len - 1){ // 文件
        const ServiceModule = require(path.resolve(file))(app);
        tempService[n] = new ServiceModule();
      }else{ // 目录
        if(!tempService[n]){
          tempService[n] = {};
        }
        tempService = tempService[n];
      }
    }
  })
  app.service = service;
}