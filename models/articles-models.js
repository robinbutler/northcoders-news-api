const query = require("../db/connection");

const fetchArticles = ({ sort_by, order, author, topic, p = 1, limit }) => {
  return query("articles")
    .select("articles.*")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comment_id as comment_count")
    .groupBy("articles.article_id")
    .modify(query => {
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ topic });
      if (limit) query.limit(limit).offset(p - 1);
    })
    .orderBy(sort_by || "created_at", order || "desc");
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

const updateArticle = (id, newVotes = 0) => {
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

const checkArticle = ({ id }) => {
  return query("articles")
    .select("*")
    .where({ article_id: id })
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: "Article not found" });
    });
};

const addNewArticle = article => {
  return query("articles")
    .insert(article)
    .returning("*");
};

const removeArticle = article_id => {
  return query("articles")
    .where({ article_id })
    .del()
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "Comment not found" });
    });
};

const fetchUserArticles = username => {
  return query("articles")
    .where({ author: username })
    .orderBy("created_at", "desc")
    .then(articles => {
      console.log(articles);
      return articles[0];
    });
};

module.exports = {
  fetchArticles,
  fetchArticleById,
  updateArticle,
  checkArticle,
  addNewArticle,
  removeArticle,
  fetchUserArticles
};
