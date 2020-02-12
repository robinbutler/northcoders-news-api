const fetchUser = require("../models/users-models");

const getUser = (req, res, next) => {
  username = req.params["username"];
  fetchUser(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = getUser;
