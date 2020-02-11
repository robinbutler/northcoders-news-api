const express = require("express");
const apiRouter = express.Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articleRouter = require("./article-router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articleRouter);

module.exports = apiRouter;
