const express = require("express");
const topicsRouter = express.Router();
const { getTopics, postTopic } = require("../controllers/topics-controllers");
const handle405errors = require("../errors/405s");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(handle405errors);

module.exports = topicsRouter;
