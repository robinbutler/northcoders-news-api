const { fetchUser, addUser } = require("../models/users-models");

const getUser = (req, res, next) => {
  const username = req.params.username;
  fetchUser(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  user = req.body;
  addUser(user)
    .then(user => {
      res.status(201).send({ user });
    })
    .catch(next);
};

module.exports = { postUser, getUser };
