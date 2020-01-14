const { selectUserByUsername } = require("../models/user-model");
exports.getUserByUsername = (req, res, next) => {
  selectUserByUsername(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(function(err) {
      next(err);
    });
};
