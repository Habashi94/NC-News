const express = require("express");
const server = express();
const apiRouter = require("./routers/api-router");

server.use("/api", apiRouter);

server.use(express.json());

server.use((err, req, res, next) => {
  console.log(err, "in error handler");
  const errCodes = {
    "22P02": { msg: "Invalid Id", status: 400 }
  };
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(errCodes[err.code].status).send({ msg: errCodes[err.code].msg });
  }
});

module.exports = server;
