const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncErrorHandler = require("express-async-handler");

const authorizeUser = asyncErrorHandler(async function (req, res, next) {
  const toBeToken = req.get("Authorization");
  if (toBeToken && toBeToken.startsWith("Bearer")) {
    let token = toBeToken.split(" ")[1];
    try {
      const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
      if (jwtPayload.exp * 1e3 - Date.now() < 0) {
        res.status(403).json({
          message: "Your token has expired",
        });
      } else {
        req.user = jwtPayload;
        const userInfo = await User.findById(req.user.id);
        req.user.isAdmin = userInfo.isAdmin;
        next();
      }
    } catch (error) {
      res.status(403).json({
        message: "You are not permitted to access the given resource",
      });
    }
  } else {
    res.status(401).json({
      message:
        "You have not been authorized yet. Please, log in or register new profile",
    });
  }
});

const authorizeAdmin = asyncErrorHandler(async function (req, res, next) {
  if (!req.user.isAdmin) {
    res.status(403).json({
      message:
        "You're not allowed to see the content of the page because you're not an admin",
    });
  } else {
    next();
  }
});

module.exports = {
  authorizeUser,
  authorizeAdmin,
};
