const express = require("express");
const server = express();
const apiRouter = require("./routers/api-router");
server.use(express.json());

server.use("/api", apiRouter);

server.use((err, req, res, next) => {
  // console.log(err.code, "in error handler");
  const errCodes = {
    "22P02": { msg: "Invalid data type inserted", status: 400 },
    "23503": { msg: "No reference to data in database", status: 422 },
    "23502": { msg: "No data provided", status: 400 },
    "42703": { msg: "Invalid column provided", status: 400 },
    "22003": { msg: "Data inputted out of range!", status: 400 }
  };
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(errCodes[err.code].status).send({ msg: errCodes[err.code].msg });
  }
});

module.exports = server;
