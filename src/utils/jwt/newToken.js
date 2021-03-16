const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config");
const newToken = (data) => {
  return jwt.sign({ _id: data._id }, jwtSecret, {});
};

module.exports = newToken;
