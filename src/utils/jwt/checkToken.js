const jwt = require("jsonwebtoken");
const { AppError } = require("../../helpers/AppError");
const { jwtSecret } = require("../../../config");
const checkToken = async (token) => {
  try {
    const verify = await jwt.verify(token, jwtSecret);
    return verify;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

module.exports = checkToken;
