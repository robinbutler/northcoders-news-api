const fetchEndpoints = require("../models/api-models");

const getEndpoints = (req, res, next) => {
  res.status(200).send(fetchEndpoints());
};

module.exports = getEndpoints;
