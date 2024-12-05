module.exports = (app) => {
  return class ProjectController {
    /**
     * 获取项目列表
     * @param {object} ctx 上下文
     */
    async getList(ctx) {
      const { project: projectService } = app.service;
      const res = await projectService.getList();
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: res,
        metadata: {}
      }
    }
  }
}