const endPoints = require("../endpoints");

exports.getEndPoints = (req, res, next) => {
  res.status(200).send(endPoints);
};
