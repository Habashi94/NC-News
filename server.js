const express = require("express");
const server = express();
const apiRouter = require("./routers/api-router");

server.use("/api", apiRouter);

server.use(express.json());

server.use((err, req, res, next) => {
  console.log(err, "in error handler");
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  console.log(err);
});

module.exports = server;
