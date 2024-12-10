module.exports = (app, router) => {
  const { project: projectController } = app.controller;
  router.get('/api/project/list', projectController.getList.bind(projectController))
}