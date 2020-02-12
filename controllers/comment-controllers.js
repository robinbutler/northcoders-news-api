const {
  addComment,
  fetchComments,
  updateCommentVotes,
  removeComment
} = require("../models/comments-models");

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

const patchComment = (req, res, next) => {
  commentId = req.params;
  newVotes = req.body;
  updateCommentVotes(commentId, newVotes)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  commentId = req.params;
  removeComment(commentId)
    .then(deletion => {
      return res.sendStatus(204);
    })
    .catch(next);
};

module.exports = { postComment, getComments, patchComment, deleteComment };
