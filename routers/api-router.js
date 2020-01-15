const apiRouter = require("express").Router();
const topicRouter = require("./topics-router");
const userRouter = require("../routers/users-router");
const articleRouter = require("../routers/article-router");
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);


apiRouter.all("/*", (req, res, next) => {
  next({ status: 404, msg: "Not Found" });
});

module.exports = apiRouter;

