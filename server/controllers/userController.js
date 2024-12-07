const connection = require("../config/db");
const { promisify } = require("util");
// const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getUserInformation = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const userQuery = `SELECT user_id, user_role, username, email, full_name, phone_number, address, nationality, country, profile_picture_url, date_of_birth, gender FROM users WHERE user_id = ?`;
    const user = await queryAsync(userQuery, [userId]);
    res.status(200).json({ success: true, user: user[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// edit user information controllers
const editName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.session.user.user_id;
    const query = `UPDATE users SET full_name = ? WHERE user_id = ?`;
    await queryAsync(query, [name, userId]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editDisplayName = async (req, res) => {
  try {
    const { displayName } = req.body;
    const userId = req.session.user.user_id;
    const query = `UPDATE users SET username = ? WHERE user_id = ?`;
    await queryAsync(query, [displayName, userId]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.session.user.user_id;
    const query = `UPDATE users SET email = ? WHERE user_id = ?`;
    await queryAsync(query, [email, userId]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const userId = req.session.user.user_id;
    const query = `UPDATE users SET phone_number = ? WHERE user_id = ?`;
    await queryAsync(query, [phoneNumber, userId]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editDateOfBirth = async (req, res) => {
  try {
    const { dateOfBirth } = req.body;
    const userId = req.session.user.user_id;
    const query = `UPDATE users SET date_of_birth = ? WHERE user_id = ?`;
    await queryAsync(query, [dateOfBirth, userId]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.session.user.user_id;
    const query = `UPDATE users SET address = ? WHERE user_id = ?`;
    await queryAsync(query, [address, userId]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editNationality = async (req, res) => {
  try {
    const { nationality } = req.body;
    const userId = req.session.user.user_id;
    const query = `UPDATE users SET nationality = ? WHERE user_id = ?`;
    await queryAsync(query, [nationality, userId]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editCountry = async (req, res) => {
  try {
    const { country } = req.body;
    const userId = req.session.user.user_id;
    const query = `UPDATE users SET country = ? WHERE user_id = ?`;
    await queryAsync(query, [country, userId]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editGender = async (req, res) => {
  try {
    const { gender } = req.body;
    const userId = req.session.user.user_id;
    const query = `UPDATE users SET gender = ? WHERE user_id = ?`;
    await queryAsync(query, [gender, userId]);
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
    // Ensure the uploads directory exists
    const uploadDir = "../server/public/uploads/users/avatars";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${userId}.avif`;
    const outputPath = path.join(uploadDir, fileName);

    // Convert image to AVIF using sharp
    await sharp(req.file.buffer)
      .avif({ quality: 50 }) // Adjust quality as needed
      .toFile(outputPath);

    // Store link to avatar file in the database
    const query = `UPDATE users SET profile_picture_url = ? WHERE user_id = ?`;
    const avatarUrl = 'http://localhost:3000/uploads/users/avatars/' + fileName;
    await queryAsync(query, [avatarUrl, userId]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error processing image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get or set favorite hotels controllers
const getFavoriteHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const query = 'SELECT hotel_id FROM saved_hotels WHERE user_id = ?';
    const favoriteHotels = await queryAsync(query, [userId]);

    for (let hotel of favoriteHotels) {
      const hotelId = hotel.hotel_id;
      const query2 = 'SELECT name, overall_rating, address, hotel_class, image_urls FROM hotels WHERE hotel_id = ?';
      const hotelInformation = await queryAsync(query2, [hotelId]);
      hotel.hotelInformation = hotelInformation[0];
    }
    res.status(200).json({hotels: favoriteHotels});
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
    const query1 = 'SELECT * FROM saved_hotels WHERE hotel_id = ? AND user_id = ?';
    const hotelIsSaved = await queryAsync(query1, [hotelId, userId]);
    if (hotelIsSaved.length > 0) {
      res.status(200).json({ success: true });
      return;
    }
    // Insert hotel into saved_hotels table
    const query2 = 'INSERT INTO saved_hotels (hotel_id, user_id) VALUES (?, ?)';
    await queryAsync(query2, [hotelId, userId]);
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
    const query = 'DELETE FROM saved_hotels WHERE hotel_id = ? AND user_id = ?';
    await queryAsync(query, [hotelId, userId]);
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
    const query = 'SELECT * FROM saved_hotels WHERE hotel_id = ? AND user_id = ?';
    const hotelIsSaved = await queryAsync(query, [hotelId, userId]);
    if (hotelIsSaved.length > 0) {
      res.status(200).json({ isFavorite: true });
    } else {
      res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    console.log("Error checking favorite hotel:", error);
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
  checkFavoriteHotel
};
