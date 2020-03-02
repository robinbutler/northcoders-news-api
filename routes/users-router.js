const express = require("express");
const usersRouter = express.Router();
const { getUser, postUser } = require("../controllers/user-controllers");
const { getUserArticles } = require("../controllers/article-controllers");
const { getUserComments } = require("../controllers/comment-controllers");
const handle405errors = require("../errors/405s");

usersRouter
  .route("/:username")
  .get(getUser)
  .post(postUser)
  .all(handle405errors);

usersRouter
  .route("/:username/articles")
  .get(getUserArticles)
  .all(handle405errors);

usersRouter
  .route("/:username/comments")
  .get(getUserComments)
  .all(handle405errors);

module.exports = usersRouter;
