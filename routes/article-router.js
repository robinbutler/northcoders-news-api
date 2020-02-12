const express = require("express");
const articleRouter = express.Router();
const {
  patchArticle,
  getArticleById,
  getArticles
} = require("../controllers/article-controllers");
const {
  postComment,
  getComments
} = require("../controllers/comment-controllers");
const handle405errors = require("../errors/405s");

articleRouter
  .route("/")
  .get(getArticles)
  .all(handle405errors);

articleRouter
  .route("/:id")
  .get(getArticleById)
  .patch(patchArticle)
  .all(handle405errors);

articleRouter
  .route("/:id/comments")
  .post(postComment)
  .get(getComments)
  .all(handle405errors);

module.exports = articleRouter;
