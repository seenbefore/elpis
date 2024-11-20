const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上面的斜杠

/**
 * router-schema loader
 * @param {object} app Koa 实例
 * 
 * 通过 'json-schema & ajv' 对API规则进行约束，配合 api-params-verify 中间件使用
 * 
 * app/router-schema/**.js
 * 
 * 输出：
 * app.routerSchema = {
 *   `${api1}`: ${jsonSchema1},
 *   `${api2}`: ${jsonSchema2},
 *   `${api3}`: ${jsonSchema3},
 *   `${api4}`: ${jsonSchema4},
 * }  
 */
module.exports = (app) => {
  // 读取 app/router-schema/**/**.js 下所有的文件
  const routerSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`);
  const fileList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`));

  // 注册所有 routerSchema，使得可以 'app.routerSchema' 访问
  let routerSchema = {};

  fileList.forEach(file => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file))
    }
  })
  app.routerSchema = routerSchema;

}