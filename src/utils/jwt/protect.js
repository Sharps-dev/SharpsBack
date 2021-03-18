const User = require("../../models/User");
const checkToken = require("./checkToken");

/**
 * prodtect middelware for check validation
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).end();
  }

  const token = bearer.split("Bearer ")[1].trim();
  let payload;
  try {
    payload = await checkToken(token);
  } catch (e) {
    console.error(e);
    return res.status(401).end();
  }

  const user = await User.findById(payload.id).lean().exec();
  if (!user) return res.status(401).end();
  const checkToken = user.tokens.includes(token);
  if (!checkToken) return res.status(400).json({ message: "not valid token" }).end();
  req.user = user;
  next();
};
module.exports = protect;
