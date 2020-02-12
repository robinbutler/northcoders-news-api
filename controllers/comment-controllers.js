const { addComment } = require("../models/comments-models");

const postComment = (req, res, next) => {
  articleId = req.params;
  newComment = req.body;
  addComment(articleId, newComment)
    .then(addedComment => {
      res.status(201).send(addedComment);
    })
    .catch(err => {
      next(err);
    });
};

module.exports = postComment;
