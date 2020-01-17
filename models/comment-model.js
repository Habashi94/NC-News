const connection = require("../db/connection");

exports.updateCommentById = ({ comment_id }, votesBody) => {
  if (
    votesBody.hasOwnProperty("inc_votes") &&
    Object.keys(votesBody).length === 1
  ) {
    return connection("comments")
      .where("comment_id", comment_id)
      .increment("votes", votesBody.inc_votes || 0)
      .returning("*")
      .then(updatedComment => {
        if (updatedComment.length === 0) {
          return Promise.reject({ msg: "Id does not exist", status: 404 });
        }
        return updatedComment[0];
      });
  } else {
    return Promise.reject({ msg: "Body provided is invalid", status: 400 });
  }
};

exports.removeCommentById = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(deleteCount => {
      if (!deleteCount) {
        return Promise.reject({
          status: 404,
          msg: "Id does not exist"
        });
      }
    });
};
