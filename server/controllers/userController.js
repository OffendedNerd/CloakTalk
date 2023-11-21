const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const sendResponse = (res, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  res.json(response);
};

module.exports.performLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const foundUser = await UserModel.findOne({ username });

    if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
      return sendResponse(res, false, "Invalid Username or Password");
    }

    delete foundUser.password;
    sendResponse(res, true, "Login successful", { user: foundUser });
  } catch (error) {
    next(error);
  }
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUsername = await UserModel.findOne({ username });
    const existingEmail = await UserModel.findOne({ email });

    if (existingUsername) {
      return sendResponse(res, false, "Username already taken");
    }

    if (existingEmail) {
      return sendResponse(res, false, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ email, username, password: hashedPassword });
    delete newUser.password;

    sendResponse(res, true, "Registration successful", { user: newUser });
  } catch (error) {
    next(error);
  }
};

module.exports.fetchAllUsers = async (req, res, next) => {
  try {
    const usersList = await UserModel.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    sendResponse(res, true, "Users fetched successfully", { users: usersList });
  } catch (error) {
    next(error);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const newAvatarImage = req.body.image;
    const updatedUserData = await UserModel.findByIdAndUpdate(
      userId,
      { isAvatarSet: true, avatarImage: newAvatarImage },
      { new: true }
    );

    sendResponse(res, true, "Avatar updated successfully", {
      isAvatarSet: updatedUserData.isAvatarSet,
      image: updatedUserData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.logoutUser = (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return sendResponse(res, false, "User ID is required");
    }

    // Assuming onlineUsers is a Map or similar data structure
    onlineUsers.delete(userId);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
