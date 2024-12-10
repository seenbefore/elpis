module.exports = (app) => class BaseController {
  /**
   * controller 基类
   * 统一收拢 controller 相关的公共方法
   */
  constructor() {
    this.app = app;
    this.config = app.config;
    this.service = app.service;
  }

  /**
   * API 处理成功时统一返回结构
   * @param {object} ctx 上下文
   * @param {object} data 核心数据
   * @param {object} metadata 附加数据
   */
  success(ctx, data = {}, metadata = {}) {
    ctx.status = 200;
    ctx.body = {
      success: true,
      data,
      metadata
    }
  }

  /**
   * API 处理失败时统一返回结构
   * @param {object} ctx 上下文
   * @param {object} message 错误信息
   * @param {object} code 错误码
   */
  fail(ctx, message, code) {
    ctx.body = {
      success: false,
      message,
      code
    }
  }
}