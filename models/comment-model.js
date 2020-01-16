const connection = require("../db/connection");

exports.updateCommentById = ({ comment_id }, votesBody) => {
  if (Object.keys(votesBody).length > 1) {
    return Promise.reject({ msg: "Body provided is invalid", status: 400 });
  } else {
    return connection("comments")
      .where("comment_id", comment_id)
      .increment("votes", votesBody.inc_vote || 0)
      .returning("*")
      .then(updatedComment => {
        if (updatedComment.length === 0) {
          return Promise.reject({ msg: "Id does not exist", status: 404 });
        }
        return updatedComment[0];
      });
  }
};

