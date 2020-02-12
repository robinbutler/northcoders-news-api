const express = require("express");
const commentRouter = express.Router();
const {
  patchComment,
  deleteComment
} = require("../controllers/comment-controllers");
const handle405errors = require("../errors/405s");

commentRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405errors);

module.exports = commentRouter;
