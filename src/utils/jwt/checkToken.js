const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config");
const checkToken = async (token) => {
  try {
    const verify = await jwt.verify(token, jwtSecret);
    return verify;
  } catch (e) {
    console.error(e);
    throw new Error("somthing wrong");
  }
};

module.exports = checkToken;
