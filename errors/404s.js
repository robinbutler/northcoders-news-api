const handle404errors = (err, req, res, next) => {
  res.status(404).send(err);
};

module.exports = handle404errors;
