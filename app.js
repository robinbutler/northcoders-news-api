const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const handle400errors = require("./errors/400s");
const handle404errors = require("./errors/404s");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handle400errors);
app.use(handle404errors);
app.use("/*", (req, res, next) =>
  res.status(404).send({ msg: "404 Route not found" })
);

module.exports = app;
