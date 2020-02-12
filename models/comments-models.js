const query = require("../db/connection");

const addComment = (article_id, comment) => {
  comment.article_id = parseInt(article_id.id);
  comment.author = comment["username"];
  delete comment.username;
  return query("comments")
    .insert(comment)
    .returning("*")
    .then(newComment => {
      return newComment[0];
    });
};

const fetchComments = ({ id }, { sort_by, order }) => {
  return query("comments")
    .select("*")
    .where({ article_id: id })
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => {
      return comments;
    });
};

const updateCommentVotes = ({ comment_id }, { inc_votes }) => {
  return query("comments")
    .increment("votes", inc_votes)
    .returning("*")
    .where({ comment_id: comment_id })
    .then(comment => {
      if (comment.length === 0)
        return Promise.reject({ status: 404, msg: "Comment not found" });
      return comment[0];
    });
};

const removeComment = ({ comment_id }) => {
  return query("comments")
    .where({ comment_id: comment_id })
    .del()
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "Comment not found" });
      return deleteCount[0];
    });
};

module.exports = {
  addComment,
  fetchComments,
  updateCommentVotes,
  removeComment
};
