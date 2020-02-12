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

module.exports = { addComment, fetchComments };
