const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      // 프론트엔드 서버는 3000번이나
      // 백엔드 서버는 5000번 이므로
      // 3000번에서 요청을보내도 5000으로 target을 지정
      changeOrigin: true,
    })
  );
};
