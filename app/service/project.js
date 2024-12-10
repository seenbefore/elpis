module.exports = (app) => {
  const BaseService = require('./base')(app);
  return class ProjectService extends BaseService {
    async getList() {
      return [
        {
          id: 1,
          name: '项目1',
          desc: '项目1描述'
        },
        {
          id: 2,
          name: '项目2',
          desc: '项目2描述'
        }
      ]
    }
  }
}