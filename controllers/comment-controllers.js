const {
  addComment,
  fetchComments,
  updateCommentVotes,
  removeComment
} = require("../models/comments-models");
const { checkArticle } = require("../models/articles-models");

const postComment = (req, res, next) => {
  const articleId = req.params;
  const newComment = req.body;
  addComment(articleId, newComment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const getComments = (req, res, next) => {
  const article_id = req.params;
  const userQuery = req.query;
  Promise.all([fetchComments(article_id, userQuery), checkArticle(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const patchComment = (req, res, next) => {
  const commentId = req.params;
  const newVotes = req.body;
  updateCommentVotes(commentId, newVotes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const commentId = req.params;
  removeComment(commentId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

module.exports = { postComment, getComments, patchComment, deleteComment };
