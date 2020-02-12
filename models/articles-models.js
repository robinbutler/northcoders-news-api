const query = require("../db/connection");

const fetchArticles = ({ sort_by, order, author, topic }) => {
  return query("articles")
    .select("*")
    .modify(query => {
      if (author) query.where({ author });
      if (topic) query.where({ topic });
    })
    .orderBy(sort_by || "created_at", order || "desc")
    .then(articles => {
      return articles;
    });
};

const fetchArticleById = id => {
  return query("articles")
    .select("articles.*")
    .where({ "articles.article_id": id })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comment_id as comment_count")
    .groupBy("articles.article_id")
    .then(article => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "User not found" });
      return article[0];
    });
};

const updateArticle = (id, newVotes) => {
  return query("articles")
    .increment("votes", newVotes)
    .returning("*")
    .where({ "articles.article_id": id })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comment_id as comment_count")
    .groupBy("articles.article_id")
    .then(article => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "User not found" });
      return article[0];
    });
};

module.exports = { fetchArticles, fetchArticleById, updateArticle };
