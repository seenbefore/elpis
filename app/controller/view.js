module.exports = (app) => {
  return class ViewController {
    /**
     * 渲染页面
     * @param {object} ctx 上下文
     */
    async renderPage(ctx) {
      await ctx.render(`output/entry.${ctx.params.page}`)
    }
  }
}