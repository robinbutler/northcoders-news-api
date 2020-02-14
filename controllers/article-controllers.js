const {
  fetchArticles,
  fetchArticleById,
  updateArticle
} = require("../models/articles-models");

const getArticles = (req, res, next) => {
  const userQuery = req.query;
  fetchArticles(userQuery)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const id = req.params.id;
  fetchArticleById(id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticle = (req, res, next) => {
  const newVote = req.body.inc_votes;
  const id = req.params.id;
  updateArticle(id, newVote)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

module.exports = { getArticleById, patchArticle, getArticles };
