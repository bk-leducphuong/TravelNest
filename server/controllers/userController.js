const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinaryConfig");
const { getModels } = require("../models/init-models.js");
const { Hotels, SavedHotels, Users } = getModels();

const getUserInformation = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const user = await Users.findOne({
      where: { user_id: userId },
      attributes: [
        "user_id",
        "user_role",
        "username",
        "email",
        "full_name",
        "phone_number",
        "address",
        "nationality",
        "country",
        "profile_picture_url",
        "date_of_birth",
        "gender",
      ],
    });
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// edit user information controllers
const editName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      {
        full_name: name,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editDisplayName = async (req, res) => {
  try {
    const { displayName } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      {
        username: displayName,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      {
        email: email,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      {
        phone_number: phoneNumber,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editDateOfBirth = async (req, res) => {
  try {
    const { dateOfBirth } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      {
        date_of_birth: dateOfBirth,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      {
        address: address,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editNationality = async (req, res) => {
  try {
    const { nationality } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      {
        nationality: nationality,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editCountry = async (req, res) => {
  try {
    const { country } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      {
        country: country,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editGender = async (req, res) => {
  try {
    const { gender } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      {
        gender: gender,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
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

    // Compress image to AVIF using sharp
    const avifBuffer = await sharp(req.file.buffer)
      .avif({ quality: 50 }) // Adjust quality as needed
      .toBuffer();

    // Upload the AVIF image buffer to Cloudinary
    cloudinary.uploader
      .upload_stream(
        { resource_type: "image", public_id: `users/avatars/${userId}` },
        async (error, result) => {
          if (error) {
            return res
              .status(500)
              .send("Failed to upload image to Cloudinary.");
          }

          // Store link to avatar file in the database
          const profilePictureUrl = result.secure_url;
          await Users.update(
            {
              profile_picture_url: profilePictureUrl,
            },
            {
              where: {
                user_id: userId,
              },
            }
          );

          res.status(200).json({ success: true });
        }
      )
      .end(avifBuffer);
  } catch (error) {
    console.log("Error processing image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get or set favorite hotels controllers
const getFavoriteHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const favoriteHotels = await SavedHotels.findAll({
      where: {
        user_id: userId,
      },
      attributes: ["hotel_id"],
    });

    for (let hotel of favoriteHotels) {
      const hotelId = hotel.hotel_id;
      const hotelInformation = await Hotels.findOne({
        where: { hotel_id: hotelId },
        attributes: [
          "name",
          "overall_rating",
          "address",
          "hotel_class",
          "image_urls",
        ],
      });
      hotel.hotelInformation = hotelInformation;
    }
    res.status(200).json({ hotels: favoriteHotels });
  } catch (error) {
    console.log("Error getting favorite hotels:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const setFavoriteHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const hotelId = req.body.hotelId;
    // Check if hotel is already saved
    const hotelIsSaved = await SavedHotels.findOne({
      where: {
        hotel_id: hotelId,
        user_id: userId,
      },
    });
    if (hotelIsSaved) {
      res.status(200).json({ success: true });
      return;
    }
    // Insert hotel into saved_hotels table
    await SavedHotels.create({
      hotel_id: hotelId,
      user_id: userId,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error setting favorite hotels:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteFavoriteHotel = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const hotelId = req.body.hotelId;
    // Delete hotel from saved_hotels table
    await SavedHotels.destroy({
      where: {
        hotel_id: hotelId,
        user_id: userId,
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error deleting favorite hotel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkFavoriteHotel = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const hotelId = req.body.hotelId;
    // Check if hotel is already saved
    const hotelIsSaved = await SavedHotels.findOne({
      where: {
        hotel_id: hotelId,
        user_id: userId,
      },
    });
    if (hotelIsSaved) {
      res.status(200).json({ isFavorite: true });
    } else {
      res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    console.log("Error checking favorite hotel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Đổi mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const userId = req.session.user.user_id;
    //const userId = 25;

    // Lấy mật khẩu mã hóa từ cơ sở dữ liệu
    const user = await Users.findOne({
      where: { user_id: userId },
    });

    if (user) {
      return res.status(404).json({ message: "User not found." });
    }

    const currentHashedPassword = user.password_hash;

    // So sánh mật khẩu cũ với mật khẩu trong cơ sở dữ liệu
    const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    await Users.update(
      {
        password_hash: hashedPassword,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  getUserInformation,
  // Edit user information controllers
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
  // Get or set favorite hotels controllers
  getFavoriteHotels,
  setFavoriteHotels,
  deleteFavoriteHotel,
  checkFavoriteHotel,
  resetPassword,
};
