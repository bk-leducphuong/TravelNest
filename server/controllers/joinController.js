const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const connection = require("../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const postJoinFormData = async (req, res) => {
  // store into hotels and rooms table in database
  const owner_id = req.session.user.user_id;
  const { joinFormData } = req.body;

  try {
    // Lưu thông tin khách sạn
    const hotelQuery = `
    INSERT INTO hotels 
    (owner_id, name, address, city, latitude, longitude, overall_rating, check_in_time, check_out_time, hotel_amenities, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    owner_id = VALUES(owner_id),
    name = VALUES(name),
    address = VALUES(address),
    city = VALUES(city),
    overall_rating = VALUES(overall_rating),
    check_in_time = VALUES(check_in_time),
    check_out_time = VALUES(check_out_time),
    hotel_amenities = VALUES(hotel_amenities),
    updated_at = VALUES(updated_at);
    `;

    const hotelResult = await queryAsync(hotelQuery, [
      owner_id,
      joinFormData.hotelName,
      joinFormData.streetName,
      joinFormData.city,
      joinFormData.coordinates.latitude,
      joinFormData.coordinates.longitude,
      joinFormData.rating,
      `${joinFormData.checkInFrom}-${joinFormData.checkInTo}`,
      `${joinFormData.checkOutFrom}-${joinFormData.checkOutTo}`,
      JSON.stringify(joinFormData.services),
      new Date(),
      new Date(),
      new Date(),
    ]);
    const hotel_id = hotelResult.insertId;

    // Lưu thông tin phòng
    const roomQuery = `
     INSERT INTO rooms 
       (room_name, max_guests, total_rooms, hotel_id, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?)
   `;
    const roomResult = await queryAsync(roomQuery, [
      joinFormData.roomDetails.roomType,
      joinFormData.roomDetails.numberOfGuests,
      joinFormData.roomDetails.numberOfRooms,
      hotel_id,
      new Date(),
      new Date(),
    ]);
    const room_id = roomResult.insertId;

    // return hotel_id and room_id if success
    res.json({
      hotel_id, // hotel_id,
      room_id, // room_id
      success: true,
      message: "Join form submitted successfully",
    });
  } catch (err) {
    console.error("Error while processing join form:", err);
    res.status(500).json({
      success: false,
      message: "Server error while processing join form",
    });
  }
};

const postPhotos = async (req, res) => {
  const { hotel_id, room_id } = req.body;

  try {
    // Ensure having uploaded files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }
    // Ensure the uploads directory exists
    const uploadDir = "../server/public/uploads/hotels";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // create directories for hotel and room
    try {
      fs.mkdirSync(path.join(uploadDir, hotel_id, room_id), { recursive: true });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server error while creating directories",
      });
      console.error("Error creating directories:", err);
    }

    // Process each uploaded image
    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const timestamp = new Date()
          .toISOString()
          .replace(/[^a-zA-Z0-9_\\-]/g, "-");
        const avifFilename = `${timestamp}.avif`;
        const outputPath = path.join(
          uploadDir,
          hotel_id,
          room_id,
          avifFilename
        ); // http://localhost:3000/public/uploads/hotels/<hotel_id>/<room_id>/1665854966123-myimage.avif

        // Convert image to AVIF using sharp
        await sharp(file.buffer)
          .avif({ quality: 50 }) // Adjust quality as needed
          .toFile(outputPath);

        return {
          originalName: file.originalname,
          avifName: avifFilename,
          path: 'http://localhost:3000' + `/uploads/hotels/${hotel_id}/${room_id}/${avifFilename}`,
        };
      })
    );

    res.json({
      success: true,
      message: "Files uploaded and converted successfully",
      files: processedFiles,
    });
  } catch (error) {
    console.error("Error processing images:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing images",
    });
  }
};

module.exports = { postJoinFormData, postPhotos };
