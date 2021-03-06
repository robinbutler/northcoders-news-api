const handle400errors = (err, req, res, next) => {
  if (
    ["22P02"].includes(err.code) ||
    ["42703"].includes(err.code) ||
    ["23502"].includes(err.code)
  )
    res.status(400).send({ msg: "Bad Request" });
  next(err);
};

module.exports = handle400errors;
