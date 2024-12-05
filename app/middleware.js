const path = require('path');

module.exports = (app) => {
  // 模板渲染引擎
  const koaNunjucks = require('koa-nunjucks-2');
  app.use(koaNunjucks({
    ext: 'tpl',
    path: path.join(process.cwd(), './app/public'),
    nunjucksConfig: {
      noCache: true,
      trimBlocks: true
    }
  }));
}