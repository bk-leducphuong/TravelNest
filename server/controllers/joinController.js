const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const {Rooms, Hotels, RoomInventories} = require("../models/init-models");

const postJoinFormData = async (req, res) => {
  const owner_id = req.session.user.user_id;
  const { joinFormData } = req.body;

  try {
    // Create or update hotel using Sequelize
    const [hotel, created] = await Hotels.upsert({
      owner_id,
      name: joinFormData.hotelName,
      address: joinFormData.streetName,
      city: joinFormData.city,
      latitude: joinFormData.coordinates.latitude,
      longitude: joinFormData.coordinates.longitude,
      overall_rating: joinFormData.rating,
      check_in_time: `${joinFormData.checkInFrom}-${joinFormData.checkInTo}`,
      check_out_time: `${joinFormData.checkOutFrom}-${joinFormData.checkOutTo}`,
      hotel_amenities: JSON.stringify(joinFormData.services),
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create room using Sequelize
    const room = await Rooms.create({
      room_name: joinFormData.roomDetails.roomType,
      max_guests: joinFormData.roomDetails.numberOfGuests,
      hotel_id: hotel.id,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create room inventory entries
    const inventoryEntries = Array.from({ length: 60 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        room_id: room.id,
        date: d,
        total_inventory: joinFormData.roomDetails.numberOfRooms,
        total_reserved: 0,
        price_per_night: 0,
        status: "open"
      };
    });

    await RoomInventories.bulkCreate(inventoryEntries);

    res.json({
      hotel_id: hotel.id,
      room_id: room.id,
      success: true,
      message: "Join form submitted successfully"
    });

  } catch (err) {
    console.error("Error while processing join form:", err);
    res.status(500).json({
      success: false,
      message: "Server error while processing join form"
    });
  }
};

const postPhotos = async (req, res) => {
  const { hotel_id, room_id } = req.body;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }

    const uploadDir = "../server/public/uploads/hotels";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
      fs.mkdirSync(path.join(uploadDir, hotel_id, room_id), { recursive: true });
    } catch (err) {
      console.error("Error creating directories:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while creating directories"
      });
    }

    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const timestamp = new Date().toISOString().replace(/[^a-zA-Z0-9_\\-]/g, "-");
        const avifFilename = `${timestamp}.avif`;
        const outputPath = path.join(uploadDir, hotel_id, room_id, avifFilename);

        await sharp(file.buffer)
          .avif({ quality: 50 })
          .toFile(outputPath);

        return {
          originalName: file.originalname,
          avifName: avifFilename,
          path: `http://localhost:3000/uploads/hotels/${hotel_id}/${room_id}/${avifFilename}`
        };
      })
    );

    // Update room with image URLs using Sequelize
    const image_urls = processedFiles.map(file => file.path);
    await Rooms.update(
      { image_urls: JSON.stringify(image_urls) },
      { where: { room_id } }
    );

    res.json({
      success: true,
      message: "Files uploaded and converted successfully",
      files: processedFiles
    });

  } catch (error) {
    console.error("Error processing images:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing images"
    });
  }
};

module.exports = { postJoinFormData, postPhotos };
