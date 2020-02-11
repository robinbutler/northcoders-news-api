const express = require("express");
const usersRouter = express.Router();
const getUser = require("../controllers/user-controllers");
const handle405errors = require("../errors/405s");

usersRouter
  .route("/:username")
  .get(getUser)
  .all(handle405errors);

module.exports = usersRouter;
