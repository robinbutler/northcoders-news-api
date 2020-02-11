const express = require("express");
const topicsRouter = express.Router();
const getTopics = require("../controllers/topics-controllers");
const handle405errors = require("../errors/405s");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405errors);

module.exports = topicsRouter;
