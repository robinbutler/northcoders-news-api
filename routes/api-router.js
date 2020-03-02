const express = require("express");
const apiRouter = express.Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");
const handle405errors = require("../errors/405s");
const getEndpoints = require("../controllers/api-controller");
const cors = require("cors");

app.use(cors());

apiRouter
  .route("/")
  .get(getEndpoints)
  .all(handle405errors);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
