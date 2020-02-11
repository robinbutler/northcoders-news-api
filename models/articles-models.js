const query = require("../db/connection");
const getCommentCount = require("./comments-models");

const fetchArticle = id => {
  return query
    .select(
      "article_id",
      "votes",
      "title",
      "topic",
      "author",
      "body",
      "created_at"
    )
    .from("articles")
    .where({ article_id: `${id}` })
    .then(async article => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "User not found" });
      const count = await getCommentCount(id);
      article[0].comment_count = count;
      return article[0];
    });
};

module.exports = fetchArticle;
