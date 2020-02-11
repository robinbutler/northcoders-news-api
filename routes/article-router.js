const express = require("express");
const articleRouter = express.Router();
const {
  patchArticle,
  getArticle
} = require("../controllers/article-controllers");
const handle405errors = require("../errors/405s");

articleRouter
  .route("/:id")
  .get(getArticle)
  .patch(patchArticle)
  .all(handle405errors);

module.exports = articleRouter;
