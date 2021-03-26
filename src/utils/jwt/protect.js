const User = require("../../models/User");
const checkToken = require("./checkToken");
const { AppError } = require("../../helpers/AppError");

/**
 * prodtect middelware for check validation
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const protect = async (req, res, next) => {
  try {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) throw new AppError("not auth", 401);

  const token = bearer.split("Bearer ")[1].trim();
    const payload = await checkToken(token);
    if (!payload) next(new AppError("not auth", 401));
    const user = await User.findById(payload._id).exec();
    if (!user) next(new AppError("not auth", 401));
    const checkTokenUser = user.tokens.includes(token);
    if (!checkTokenUser) next(new AppError("not valid token", 401));
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
module.exports = protect;
