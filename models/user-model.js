const connection = require("../db/connection");

exports.selectUserByUsername = ({ username }) => {
  return connection("users")
    .select("*")
    .where("username", username)
    .then(userResponse => {
      if (userResponse.length === 0) {
        return Promise.reject({ msg: "Username does not exist", status: 404 });
      }
      return userResponse;
    });
};
