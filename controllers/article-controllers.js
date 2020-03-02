const {
  fetchArticles,
  fetchArticleById,
  updateArticle,
  addNewArticle,
  removeArticle,
  fetchUserArticles
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

const postArticle = (req, res, next) => {
  const newArticle = req.body;
  addNewArticle(newArticle)
    .then(article => {
      article = article[0];
      res.status(201).send({ article });
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { id } = req.params;
  removeArticle(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

const getUserArticles = (req, res, next) => {
  const { username } = req.params;
  fetchUserArticles(username)
    .then(userArticles => {
      res.status(200).send({ userArticles });
    })
    .catch(next);
};

module.exports = {
  getArticleById,
  patchArticle,
  getArticles,
  postArticle,
  deleteArticle,
  getUserArticles
};
