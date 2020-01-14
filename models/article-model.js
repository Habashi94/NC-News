const connection = require("../db/connection");

exports.selectArticleById = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .count({ comment_count: "articles.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(articleResponse => {
      console.log(articleResponse);
      if (articleResponse.length === 0) {
        return Promise.reject({ msg: "Id does not exist", status: 404 });
      }
      return articleResponse[0];
    });
};
