const connection = require("../db/connection");

exports.selectArticleById = ({ article_id }) => {
  return connection("articles")
    .select(
      "author",
      "title",
      "article_id",
      "body",
      "topic",
      "created_at",
      "votes"
    )
    .innerJoin("users", "articles.author", "users.username")
    .where("article_id", article_id)
    .then(articleResponse => {
      return articleResponse[0];
    });
};
