const connection = require("../../config/db");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { promisify } = require("util");
const cloudinary = require("../../config/cloudinaryConfig");
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});

const queryAsync = promisify(connection.query).bind(connection);

const getAllRooms = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing hotelId" });
    }
    const rooms = await queryAsync(
      `SELECT * FROM rooms WHERE hotel_id = ${hotelId}`
    );
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateRoomInformation = async (req, res) => {
  try {
    const { roomInformation } = req.body;
    if (!roomInformation) {
      return res
        .status(400)
        .json({ success: false, message: "Missing roomInformation" });
    }
    const query = `UPDATE rooms SET room_name = ?, room_type = ?, quantity = ? WHERE room_id = ?`;
    await queryAsync(query, [
      roomInformation.room_name,
      roomInformation.room_type,
      roomInformation.quantity,
      roomInformation.room_id,
    ]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createNewRoom = async (req, res) => {
  try {
    const { hotelId, roomInformation } = req.body;
    if (!roomInformation || !hotelId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing roomInformation" });
    }
    const query = `INSERT INTO rooms (hotel_id, room_name, room_type, quantity) VALUES (?, ?, ?, ?)`;
    const { insertId: roomId } = await queryAsync(query, [
      hotelId,
      roomInformation.room_name,
      roomInformation.room_type,
      roomInformation.quantity,
    ]);

    // generate room inventory
    const NUMBER_OF_DAYS = 60; // 1 months

    for (let i = 0; i < NUMBER_OF_DAYS; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const queryRoomInventory = `INSERT INTO room_inventory (room_id, date, total_inventory, total_reserved, price_per_night, status) VALUES (?, ?, ?, ?, ?, ?)`;
      await queryAsync(queryRoomInventory, [
        roomId,
        d,
        roomInformation.quantity,
        0,
        0,
        "open",
      ]);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing roomInformation" });
    }

    // delete room inventory from room_inventory table
    const query1 = `DELETE FROM room_inventory WHERE room_id = ?`;
    await queryAsync(query1, [roomId]);
    // delete room from rooms table
    const query2 = `DELETE FROM rooms WHERE room_id = ?`;
    await queryAsync(query2, [roomId]);

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// room photos
const getAllRoomPhotos = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing hotelId" });
    }
    const rooms = await queryAsync(
      `SELECT room_id, room_name, image_urls FROM rooms WHERE hotel_id = ${hotelId}`
    );
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteRoomPhotos = async (req, res) => {
  try {
    const { roomId, deletedRoomPhotosUrls } = req.body;
    const deletedRoomPhotosUrlsArray = JSON.parse(deletedRoomPhotosUrls);

    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing roomId" });
    }

    const oldImageUrls = await queryAsync(`SELECT image_urls FROM rooms WHERE room_id = ?`, [roomId]);
    const oldImageUrlsArray = JSON.parse(oldImageUrls[0].image_urls);
    deletedRoomPhotosUrlsArray.forEach(url => {
      oldImageUrlsArray.splice(oldImageUrlsArray.indexOf(url), 1);
    })

    // Extract publicId from cloudinary URL
    const regex = /\/upload\/(?:v\d+\/)?(.+?)\./;
    const cloudinaryUrls = deletedRoomPhotosUrlsArray.map(url => url.match(regex)[1]);
    //Delete from cloudinary
    await Promise.all(
      cloudinaryUrls.map(async url => {
        await cloudinary.uploader.destroy(url, {
          resource_type: "image"
        });
      })
    )

    const isUpdateSuccess = await updateRoomPhotos(JSON.stringify(oldImageUrlsArray), roomId);
    if (isUpdateSuccess) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteHotelPhotos = async (req, res) => {
  try {
    const { hotelId, imageUrls } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing hotelId" });
    }
    const query = `UPDATE hotels SET image_urls = ? WHERE hotel_id = ?`;
    await queryAsync(query, [imageUrls, hotelId]);

    //TODO: delete from file system
    //...
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addRoomPhotos = async (req, res) => {
  try {
    const { roomId, hotelId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Missing files" });
    }

    // Process each uploaded image
    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const timestamp = new Date().toISOString().replace(/[^a-zA-Z0-9_\\-]/g, "-");

        // Convert image to AVIF using sharp
        const avifBuffer = await sharp(file.buffer)
          .avif({ quality: 50 }) // Adjust quality as needed
          .toBuffer();

        // Upload AVIF to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              public_id: `hotels/${hotelId}/rooms/${roomId}/${timestamp}`,
            },
            (error, result) => {
              if (error) {
                console.error("Error uploading to Cloudinary:", error);
                return reject(error);
              }
              resolve(result);
            }
          ).end(avifBuffer);
        });

        return { url: result.secure_url };
      })
    );

    // update room photo urls
    const oldImageUrls = await queryAsync(`SELECT image_urls FROM rooms WHERE room_id = ?`, [roomId]);
    const oldImageUrlsArray = JSON.parse(oldImageUrls[0].image_urls);
    processedFiles.forEach(file => {
      oldImageUrlsArray.push(file.url);
    })

    const isUpdateSuccess = await updateRoomPhotos(JSON.stringify(oldImageUrlsArray), roomId);
    if (isUpdateSuccess) {
      res.status(200).json({ files: processedFiles });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error in addRoomPhotos:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addHotelPhotos = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      res.status(400).json({ success: false, message: "Missing hotel id" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Missing files" });
    }

    // Process each uploaded image
    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const timestamp = new Date()
          .toISOString()
          .replace(/[^a-zA-Z0-9_\\-]/g, "-");

        // Convert image to AVIF using sharp
        const avifBuffer =  await sharp(file.buffer)
          .avif({ quality: 50 }) // Adjust quality as needed
          .toBuffer();

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              public_id: `hotels/${hotelId}/${timestamp}`
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(avifBuffer);
        });

        return result.secure_url;
      })
    );

    res.status(200).json({ files: processedFiles });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateRoomPhotos = async (newImageUrls, roomId) => {
  try {
    const query = `UPDATE rooms SET image_urls = ? WHERE room_id = ?`;
    await queryAsync(query, [newImageUrls, roomId]);
    return true; 
  }catch(error) {
    return false;
  }
}

// room amenities
const getAllRoomAmenities = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing roomId" });
    }
    const rooms = await queryAsync(
      `SELECT room_id, room_name, room_amenities, room_size FROM rooms WHERE hotel_id = ?`,
      [hotelId]
    );
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateRoomAmenities = async (req, res) => {
  try {
    const { rooms } = req.body;
    if (!rooms || rooms.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing roomId" });
    }

    for (const room of rooms) {
      const query = `UPDATE rooms SET room_amenities = ?, room_size = ? WHERE room_id = ?`;
      await queryAsync(query, [
        room.room_amenities,
        room.room_size,
        room.room_id,
      ]);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// room inventory
const getRoomInventory = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing roomId" });
    }
    const rooms = await queryAsync(
      `SELECT * FROM room_inventory WHERE room_id = ?`,
      [roomId]
    );
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateRoomInventory = async (req, res) => {
  try {
    const { newRoomInventory } = req.body;
    if (newRoomInventory.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing newRoomInventory" });
    }
    const query = `UPDATE room_inventory SET status = ?, price_per_night = ?, total_reserved = ? WHERE room_id = ? AND date = ?`;

    for (let i = 0; i < newRoomInventory.length; i++) {
      const room = newRoomInventory[i];
      await queryAsync(query, [
        room.status,
        room.price_per_night,
        room.total_reserved,
        room.room_id,
        room.date.split("T")[0],
      ]);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllRooms,
  updateRoomInformation,
  createNewRoom,
  deleteRoom,
  getAllRoomPhotos,
  deleteRoomPhotos,
  deleteHotelPhotos,
  addRoomPhotos,
  addHotelPhotos,
  getAllRoomAmenities,
  updateRoomAmenities,
  getRoomInventory,
  updateRoomInventory,
};
