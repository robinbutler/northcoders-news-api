const query = require("../db/connection");

const getCommentCount = article_id => {
  return query("comments")
    .count("comment_id")
    .where({ article_id: `${article_id}` })
    .then(count => {
      return count[0].count;
    });
};

module.exports = getCommentCount;
