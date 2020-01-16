const articleRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getAllArticles
} = require("../controllers/article-controller");

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articleRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId);

articleRouter.route("/").get(getAllArticles);

module.exports = articleRouter;
