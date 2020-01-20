const commentRouter = require("express").Router();
const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/comment-controller");

const { send405Error } = require("../error-index");

commentRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(send405Error);

module.exports = commentRouter;
