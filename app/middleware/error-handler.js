/**
 * 运行时异常错误处理，兜底所有异常
 * @param {object} app koa实例
 */
module.exports = (app) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      // 异常处理
      const { status, message, detail } = error;

      app.logger.info(JSON.stringify(error));
      app.logger.error('[-- exception --]', error);
      app.logger.error('[-- exception --]', status, message, detail);

      // 访问不存在的页面
      if(message && message.indexOf('template not found') > -1) {
        // 页面重定向
        ctx.status = 302; // 临时重定向
        ctx.redirect(`${app.options?.homePage}`);
        return;
      }

      const resBody = {
        success: false,
        code: 50000,
        message: '网络异常，请稍后重试',
      }

      ctx.status = 200;
      ctx.body = resBody;
    }
  }
}