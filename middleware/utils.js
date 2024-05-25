const jwt = require("jsonwebtoken");

exports.generateAccessToken = function (user, secret, expiresIn) {
  return jwt.sign(user, secret, { expiresIn: expiresIn });
};
