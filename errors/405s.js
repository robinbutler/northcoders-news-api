const handle405errors = (req, res, next) => {
  return res.status(405).send({ msg: "Invalid method" });
};

module.exports = handle405errors;
