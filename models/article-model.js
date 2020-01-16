const connection = require("../db/connection");

exports.selectArticleById = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(articleResponse => {
      if (articleResponse.length === 0) {
        return Promise.reject({ msg: "Id does not exist", status: 404 });
      }
      const formattedArticles = articleResponse.map(article => {
        const copiedArticle = { ...article };
        copiedArticle.comment_count = +copiedArticle.comment_count;
        return copiedArticle;
      });

      return formattedArticles[0];
    });
};

exports.updateArticleById = ({ article_id }, votesBody) => {
  if (Object.keys(votesBody).length > 1) {
    return Promise.reject({ msg: "Body provided is invalid", status: 400 });
  } else {
    return connection("articles")
      .where("article_id", article_id)
      .increment("votes", votesBody.inc_votes || 0)
      .returning("*")
      .then(updatedArticle => {
        if (updatedArticle.length === 0) {
          return Promise.reject({ msg: "Id does not exist", status: 404 });
        }

        return updatedArticle[0];
      });
  }
};

exports.insertCommentByArticleId = ({ article_id }, { username, body }) => {
  return connection("comments")
    .insert({ author: username, body: body, article_id: article_id })
    .returning("*")
    .then(newComment => {
      console.log(newComment);
      if (newComment.length === 0) {
        return Promise.reject({ msg: "Id does not exist", status: 404 });
      }

      return newComment[0];
    });
};

exports.selectCommentsByArticleId = ({ article_id }, { sort_by, order }) => {
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(commentResult => {
      if (commentResult.length === 0) {
        return Promise.reject({ msg: "No comment exists", status: 404 });
      }

      return commentResult;
    });
};

exports.selectAllArticles = ({ sort_by, order, topic, author }) => {
  if (order !== "asc" && order !== "desc" && order != undefined) {
    return Promise.reject({ msg: "Invalid order requested", status: 400 });
  } else {
    return connection
      .select(
        "articles.author",
        "articles.title",
        "articles.article_id",
        "articles.topic",
        "articles.created_at",
        "articles.votes"
      )
      .from("articles")
      .count({ comment_count: "comments.article_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by || "created_at", order || "desc")
      .modify(queryChain => {
        if (topic) {
          queryChain.where("topic", topic);
        }
        if (author) {
          queryChain.where("articles.author", author);
        }
      })
      .then(allArticles => {
        if (allArticles.length === 0) {
          if (author) {
            return connection("users")
              .select("*")
              .where("username", author)
              .then(name => {
                if (name.length === 0) {
                  return Promise.reject({
                    msg: "Author does not exist",
                    status: 404
                  });
                }
                return Promise.reject({
                  msg: "No Article Found",
                  status: 404
                });
              });
          } else if (topic) {
            return connection("topics")
              .select("*")
              .where("slug", topic)
              .then(result => {
                if (result.length === 0) {
                  return Promise.reject({
                    msg: "Topic does not exist",
                    status: 404
                  });
                }
                return Promise.reject({
                  msg: "No Article Found",
                  status: 404
                });
              });
          }
        }
        const formattedArticles = allArticles.map(article => {
          const copiedArticles = { ...article };
          copiedArticles.comment_count = +copiedArticles.comment_count;
          return copiedArticles;
        });
        return formattedArticles;
      });
  }
};

/*
 */
