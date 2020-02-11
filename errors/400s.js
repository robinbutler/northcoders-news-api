const handle400errors = (err, req, res, next) => {
  const psqlBadRequestCode = ["22P02"];
  if (psqlBadRequestCode.includes(err.code))
    res.status(400).send({ msg: "Bad Request" });
  next(err);
};

module.exports = handle400errors;
