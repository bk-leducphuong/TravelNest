const userService = require("../services/user.service");

/**
 * User Controller - HTTP ↔ business mapping
 */

const getUserInformation = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const user = await userService.getUserInformation(userId);
    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.session.user.user_id;
    await userService.updateName(userId, name);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editDisplayName = async (req, res) => {
  try {
    const { displayName } = req.body;
    const userId = req.session.user.user_id;
    await userService.updateDisplayName(userId, displayName);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.session.user.user_id;
    await userService.updateEmail(userId, email);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const userId = req.session.user.user_id;
    await userService.updatePhoneNumber(userId, phoneNumber);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editDateOfBirth = async (req, res) => {
  try {
    const { dateOfBirth } = req.body;
    const userId = req.session.user.user_id;
    await userService.updateDateOfBirth(userId, dateOfBirth);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.session.user.user_id;
    await userService.updateAddress(userId, address);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editNationality = async (req, res) => {
  try {
    const { nationality } = req.body;
    const userId = req.session.user.user_id;
    await userService.updateNationality(userId, nationality);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editCountry = async (req, res) => {
  try {
    const { country } = req.body;
    const userId = req.session.user.user_id;
    await userService.updateCountry(userId, country);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editGender = async (req, res) => {
  try {
    const { gender } = req.body;
    const userId = req.session.user.user_id;
    await userService.updateGender(userId, gender);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const userId = req.session.user.user_id.toString();
    await userService.updateAvatar(userId, req.file.buffer);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error processing image:", error);
    if (error.message === "Failed to upload image to Cloudinary") {
      return res.status(500).send("Failed to upload image to Cloudinary.");
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getFavoriteHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const hotels = await userService.getFavoriteHotels(userId);
    res.status(200).json({ hotels });
  } catch (error) {
    console.log("Error getting favorite hotels:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const setFavoriteHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const { hotelId } = req.body;
    await userService.addFavoriteHotel(userId, hotelId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error setting favorite hotels:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteFavoriteHotel = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const { hotelId } = req.body;
    await userService.removeFavoriteHotel(userId, hotelId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error deleting favorite hotel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkFavoriteHotel = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const { hotelId } = req.body;
    const isFavorite = await userService.checkFavoriteHotel(userId, hotelId);
    res.status(200).json({ isFavorite });
  } catch (error) {
    console.log("Error checking favorite hotel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const userId = req.session.user.user_id;
    await userService.resetPassword(userId, oldPassword, newPassword);

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Old password is incorrect") {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getUserInformation,
  editName,
  editDisplayName,
  editEmail,
  editPhoneNumber,
  editDateOfBirth,
  editAddress,
  editNationality,
  editCountry,
  editGender,
  editAvatar,
  getFavoriteHotels,
  setFavoriteHotels,
  deleteFavoriteHotel,
  checkFavoriteHotel,
  resetPassword,
};
