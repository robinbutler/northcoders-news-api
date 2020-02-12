const { addComment, fetchComments } = require("../models/comments-models");

const postComment = (req, res, next) => {
  articleId = req.params;
  newComment = req.body;
  addComment(articleId, newComment)
    .then(addedComment => {
      res.status(201).send({ addedComment });
    })
    .catch(next);
};

const getComments = (req, res, next) => {
  articleId = req.params;
  userQuery = req.query;
  fetchComments(articleId, userQuery)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = { postComment, getComments };
