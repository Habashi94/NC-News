const userRouter = require("express").Router();
const {
  getUserByUsername,
  getUsers
} = require("../controllers/user-controller");
const { send405Error } = require("../error-index");

userRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

userRouter.route("/").get(getUsers);

module.exports = userRouter;
