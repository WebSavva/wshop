const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const generateUserJWT = require("./../utils/generateUserJWT");

// @desc handles user authentication (login process) by matching sent data with DB data
// @method GET api/users/login
// @access PUBLIC
const authenticateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const requestedUser = await User.findOne({ email: email.toLowerCase() });
  if (requestedUser && (await requestedUser.matchPassword(password))) {
    res.status(200).json({
      ...requestedUser.toClient(),
      token: generateUserJWT(requestedUser._id),
    });
  } else {
    res.status(401).json({
      message: "Invalid email or password",
    });
  }
});

// @desc send the user information, e.g email, name and authority status
// @method GET api/users/profile
// @access PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
  const userInfo = await User.findById(req.user.id).select("-password");

  if (req.user.id !== userInfo._id.toString() && !req.user.isAdmin) {
    res.status(403).json({
      message:
        "You're not allowed to update the profile data of the given user",
    });
  }

  res.status(200).json(userInfo.toClient());
});

// @desc send the information about all users
// @method GET api/users
// @access PRIVATE/Admin
const getUsers = asyncHandler(async (req, res) => {
  const usersInfo = await User.find({
    _id: {
      $ne: req.user.id,
    },
  }).select("-password");

  res.status(200).json(usersInfo.map((userData) => userData.toClient()));
});

// @desc get user by id
// @method GET api/users/:id
// @access PRIVATE/Admin
const getUserById = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  try {
    const usersInfo = await User.findById(userId).select("-password");
    res.status(200).json(usersInfo.toClient());
  } catch {
    res.status(404).json({
      message: "No user found",
    });
  }

  res.status(200).json(usersInfo.map((userData) => userData.toClient()));
});

// @desc delete user by id
// @method POST api/users/:id/delete
// @access PRIVATE/Admin
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id: userId } = req.params;
    const usersInfo = await User.deleteOne({
      _id: userId,
    });

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({
      message: "Such user does not exist",
    });
  }
});

// @desc edit used info
// @method PUT api/users/:id/edit
// @access PRIVATE/Admin
const editUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { email, name, password, isAdmin } = req.body;
  let userInfo;

  try {
    userInfo = await User.findById(userId);
  } catch {
    res.status(404).json({
      message: "Such user does not exist",
    });
  }

  if (email) userInfo.email = email;
  if (name) userInfo.name = name;
  if (password) userInfo.password = password;
  if (isAdmin !== undefined) userInfo.isAdmin = isAdmin;

  const updatedUser = await userInfo.save();
  res.status(201).json(updatedUser.toClient());
});

// @desc update user profile details
// @method PUT api/users/profile
// @access PRIVATE
const updateUserProfile = asyncHandler(async (req, res) => {
  let userInfo;
  const { email, name, password } = req.body;

  try {
    userInfo = await User.findById(req.user.id);
  } catch {
    res.status(404).json({
      message: "Such user does not exist",
    });
  }

  if (req.user.id !== userInfo._id.toString() && !req.user.isAdmin) {
    res.status(403).json({
      message:
        "You're not allowed to update the profile data of the given user",
    });
  }

  userInfo.email = email;
  if (name) userInfo.name = name;
  if (password) userInfo.password = password;

  const updatedUser = await userInfo.save();
  res.status(201).json({
    ...userInfo.toClient(),
    token: generateUserJWT(updatedUser._id),
  });
});

// @desc user registration and jwt generation, respectively
// @method POST api/users
// @access PUBLIC
const registerNewUser = asyncHandler(async (req, res) => {
  const {
    email: newUserEmail,
    name: newUserName,
    password: newUserPassword,
    isAdmin: newUserAdmin,
  } = req.body;

  let newUser;
  const existedUser = await User.findOne({ email: newUserEmail.toLowerCase() });

  if (existedUser) {
    res.status(400).json({
      message: "Such user already exists",
    });
  } else {
    newUser = await User.create({
      email: newUserEmail.toLowerCase(),
      name: newUserName,
      password: newUserPassword,
      ...(req.user &&
        req.user.isAdmin && {
          isAdmin: newUserAdmin,
        }),
    });
  }

  if (newUser) {
    let responseData =
      req.user && req.user.isAdmin
        ? true
        : {
            ...newUser.toClient(),
            token: generateUserJWT(newUser._id),
          };
    res.status(201).json(responseData);
  }
});

module.exports = {
  authenticateUser,
  getUserProfile,
  registerNewUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  editUser,
  getUserById,
};
