const { fetchArticle, updateArticle } = require("../models/articles-models");

const getArticle = (req, res, next) => {
  id = req.params["id"];
  fetchArticle(id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticle = (req, res, next) => {
  newVote = req.body.inc_votes;
  id = req.params.id;
  updateArticle(id, newVote)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};

module.exports = { getArticle, patchArticle };
