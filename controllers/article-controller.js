const {
  selectArticleById,
  updateArticleById,
  insertCommentByArticleId,
  selectCommentsByArticleId,
  selectAllArticles
} = require("../models/article-model");

exports.getArticleById = (req, res, next) => {
  selectArticleById(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(function(err) {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  insertCommentByArticleId(req.params, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  selectCommentsByArticleId(req.params, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  //check if authzor exist --> another model
  //  if exist carry on fetching articles
  // if doesn't exist, the check if exist model will through an error

  selectAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
