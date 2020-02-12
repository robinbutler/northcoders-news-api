const query = require("../db/connection");

const getCommentCount = article_id => {
  return query("comments")
    .count("comment_id")
    .where({ article_id: `${article_id}` })
    .then(count => {
      return count[0].count;
    });
};

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

module.exports = { getCommentCount, addComment };
