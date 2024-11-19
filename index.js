const Koa = require('koa');

// koa 实例
const app = new Koa();

try {
  const port = process.env.PORT || 8080;
  const host = process.env.IP || '0.0.0.0';
  app.listen(port, host);
  console.log(`Server running on http://${host}:${port}`);
} catch(e){
  console.log(e);
}
