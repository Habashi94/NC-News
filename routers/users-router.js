const userRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/user-controller");
const { send405Error } = require("../error-index");

userRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = userRouter;
