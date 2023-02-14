const Koa = require("koa");
const koaStatic = require("koa-static");
const koaMount = require("koa-mount");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const k2c = require("koa2-connect");

const resolve = file => path.resolve(__dirname, file);
const port = process.env.PORT || 3000;

const app = new Koa();
/** @type {import('http-proxy-middleware/dist/types').Options} */
const stageApiOptions = {
  target: "http://kkteacher-crm-test.kukewang.com:30080",
  changeOrigin: true,
  ws: false,
  pathRewrite: {
    "^/stage-api": "/stage-api"
  },
  router: {}
};
/** @type {import('http-proxy-middleware/dist/types').Options} */
const prodApiOptions = {
  target: "https://micro.kuke99.com",
  changeOrigin: true,
  ws: false,
  pathRewrite: {
    "^/prod-api": "/prod-api"
  },
  router: {}
};
app.use(async (ctx, next) => {
  const url = ctx.path;
  if (url.startsWith("/stage-api")) {
    ctx.respond = false;
    await k2c(createProxyMiddleware(stageApiOptions))(ctx, next);
    return await next();
  }
  if (url.startsWith("/prod-api")) {
    ctx.respond = false;
    await k2c(createProxyMiddleware(prodApiOptions))(ctx, next);
    return await next();
  }
  return await next();
});

// 开放目录
app.use(koaMount("/", koaStatic(resolve("../../agent_pc/dist"))));
app.use(koaMount("/agent", koaStatic(resolve("../dist"))));

app.listen(port, () => {
  console.log(
    `
    C端: http://localhost:${port}/
    B端: http://localhost:${port}/agent
    `
  );
});
