const handle404errors = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: `${err.msg}` });
  next(err);
};

module.exports = handle404errors;
