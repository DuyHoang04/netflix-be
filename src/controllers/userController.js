const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const userController = {
  updateUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { username, email } = req.body;

      const newDataUser = {
        username,
        email,
      };

      if (req.files["picturePath"]) {
        console.log("vo");
        newDataUser.picturePath = req.files["picturePath"][0].path;
      }

      await userModel
        .findByIdAndUpdate(
          userId,
          {
            $set: newDataUser,
          },
          {
            new: true,
          }
        )
        .then(() => {
          res
            .status(200)
            .json({ success: true, message: "Update Successfully" });
        });
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const { oldPassword, newPassword } = req.body;

      const userCheck = await userModel.findById(userId);

      if (!userCheck)
        return res
          .status(404)
          .json({ success: false, message: "Incorrect User" });

      const isMatchPass = await bcrypt.compare(oldPassword, userCheck.password);

      if (!isMatchPass) {
        return res
          .status(404)
          .json({ success: false, message: "Incorrect Password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await userCheck.save();

      res
        .status(200)
        .json({ status: true, msg: "Change password successfully" });
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { userId } = req.params;

      await userModel.findByIdAndDelete(userId);

      res
        .status(200)
        .json({ success: true, message: "Delete User Successfully" });
    } catch (err) {
      next(err);
    }
  },

  getDetailUser: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const user = await userModel
        .findById(userId)
        .populate("likedMovies")
        .populate({
          path: "likedMovies",
          populate: {
            path: "genres",
            model: "Genres",
            select: "name",
          },
        });

      const { password, ...more } = user._doc;

      res.status(200).json({ success: true, data: { ...more } });
    } catch (err) {
      next(err);
    }
  },

  getAllUser: async (req, res, next) => {
    try {
      const user = await userModel
        .find({}, "-password -likedMovies")
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  getLikedMovie: async (req, res, next) => {
    try {
      const { id } = req.user;
      const user = await userModel.findById(id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
      const { likedMovies } = user;
      res.status(200).json({ success: true, data: likedMovies });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
