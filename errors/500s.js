const handle500errors = (err, req, res, next) => {
  //console.log(err);
  res.sendStatus(500);
};

module.exports = handle500errors;
