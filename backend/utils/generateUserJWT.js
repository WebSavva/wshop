const jwt = require("jsonwebtoken");

function generateUserJWT(id) {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5d",
    }
  );
}

module.exports = generateUserJWT;
