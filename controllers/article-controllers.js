const fetchArticle = require("../models/articles-models");

const getArticle = (req, res, next) => {
  id = req.params["id"];
  fetchArticle(id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

const patchArticle = (req, res, next) => {
  newVote = req.body.inc_votes;
  id = req.params.id;
  changeVotes(id, newVote)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { getArticle, patchArticle };
