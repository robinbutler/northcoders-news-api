const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const handle400errors = require("./errors/400s");
const handle404errors = require("./errors/404s");
const handle422errors = require("./errors/422s");
const handle500errors = require("./errors/500s");

app.use(express.json());

app.use("/api", apiRouter);
app.use("/*", (req, res, next) =>
  res.status(404).send({ msg: "404 Route not found" })
);

app.use(handle400errors);
app.use(handle404errors);
app.use(handle422errors);
app.use(handle500errors);

module.exports = app;
