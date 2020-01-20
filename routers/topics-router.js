const topicRouter = require("express").Router();
const { getTopics } = require("../controllers/topic-controller");
const { send405Error } = require("../error-index");

topicRouter
  .route("/")
  .get(getTopics)
  .all(send405Error);

module.exports = topicRouter;
