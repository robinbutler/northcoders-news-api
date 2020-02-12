const handle422errors = (err, req, res, next) => {
  if (["23503"].includes(err.code))
    res.status(422).send({ msg: "Unprocessable input" });
  next(err);
};

module.exports = handle422errors;
