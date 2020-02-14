const handle500errors = (err, req, res, next) => {
  res.sendStatus(500);
};

module.exports = handle500errors;
