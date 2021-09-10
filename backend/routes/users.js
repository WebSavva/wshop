const express = require("express");
const {
  authenticateUser,
  getUserProfile,
  registerNewUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  editUser,
  getUserById,
} = require("./../controllers/userController");
const {
  authorizeUser,
  authorizeAdmin,
} = require("./../middleware/authorizationMiddleware");

const router = express.Router();

router.route("/login").post(authenticateUser);

router
  .route("/profile")
  .get(authorizeUser, getUserProfile)
  .put(authorizeUser, updateUserProfile);
router.route("/").post(registerNewUser);

module.exports = router;
