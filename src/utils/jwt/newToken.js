const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config");
const newToken = (data, expiresIn) => {
    const options = {};
    if (expiresIn)
        options.expiresIn = expiresIn;
    return jwt.sign({ _id: data._id }, jwtSecret, options);
};

module.exports = newToken;
