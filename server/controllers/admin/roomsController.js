const sharp = require('sharp');
const cloudinary = require('../../config/cloudinary.config');

const { getModels } = require('../../models/init-models.js');
const { Rooms, RoomInventories, Hotels } = getModels();

const getAllRooms = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing hotelId' });
    }
    const rooms = await Rooms.findAll({
      where: {
        hotel_id: hotelId,
      },
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateRoomInformation = async (req, res) => {
  try {
    const { roomInformation } = req.body;
    if (!roomInformation) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing roomInformation' });
    }
    await Rooms.update(
      {
        room_name: roomInformation.room_name,
        room_type: roomInformation.room_type,
        quantity: roomInformation.quantity,
      },
      {
        where: {
          room_id: roomInformation.room_id,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createNewRoom = async (req, res) => {
  try {
    const { hotelId, roomInformation } = req.body;
    if (!roomInformation || !hotelId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing roomInformation' });
    }

    const newRoom = await Rooms.create({
      hotel_id: hotelId,
      room_name: roomInformation.room_name,
      room_type: roomInformation.room_type,
      quantity: roomInformation.quantity,
    });
    // generate room inventory
    const NUMBER_OF_DAYS = 60; // 1 months

    for (let i = 0; i < NUMBER_OF_DAYS; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      await RoomInventories.create({
        room_id: newRoom.room_id,
        date: d,
        total_inventory: roomInformation.quantity,
        total_reserved: 0,
        price_per_night: 0,
        status: 'open',
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing roomInformation' });
    }

    // delete room inventory from room_inventory table
    await RoomInventories.destroy({
      where: {
        room_id: roomId,
      },
    });
    // delete room from rooms table
    await Rooms.destroy({
      where: {
        room_id: roomId,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// room photos
const getAllRoomPhotos = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing hotelId' });
    }
    const rooms = await Rooms.findAll({
      where: {
        hotel_id: hotelId,
      },
      attributes: ['room_id', 'room_name', 'image_urls'],
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteRoomPhotos = async (req, res) => {
  try {
    const { roomId, deletedRoomPhotosUrls } = req.body;
    const deletedRoomPhotosUrlsArray = JSON.parse(deletedRoomPhotosUrls);

    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing roomId' });
    }

    const oldImageUrls = await Rooms.findOne({
      where: {
        room_id: roomId,
      },
      attributes: ['image_urls'],
    });
    const oldImageUrlsArray = JSON.parse(oldImageUrls.image_urls);
    deletedRoomPhotosUrlsArray.forEach((url) => {
      oldImageUrlsArray.splice(oldImageUrlsArray.indexOf(url), 1);
    });

    // Extract publicId from cloudinary URL
    const regex = /\/upload\/(?:v\d+\/)?(.+?)\./;
    const cloudinaryUrls = deletedRoomPhotosUrlsArray.map(
      (url) => url.match(regex)[1]
    );
    //Delete from cloudinary
    await Promise.all(
      cloudinaryUrls.map(async (url) => {
        await cloudinary.uploader.destroy(url, {
          resource_type: 'image',
        });
      })
    );

    const isUpdateSuccess = await updateRoomPhotos(
      JSON.stringify(oldImageUrlsArray),
      roomId
    );
    if (isUpdateSuccess) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteHotelPhotos = async (req, res) => {
  try {
    const { hotelId, deletedHotelPhotosUrls } = req.body;
    const deletedHotelPhotosUrlsArray = JSON.parse(deletedHotelPhotosUrls);

    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing hotelId' });
    }

    const oldImageUrls = await Hotels.findOne({
      where: {
        hotel_id: hotelId,
      },
      attributes: ['image_urls'],
    });
    const oldImageUrlsArray = JSON.parse(oldImageUrls.image_urls);
    deletedHotelPhotosUrlsArray.forEach((url) => {
      oldImageUrlsArray.splice(oldImageUrlsArray.indexOf(url), 1);
    });

    // Extract publicId from Cloudinary URL
    const regex = /\/upload\/(?:v\d+\/)?(.+?)\./;
    const cloudinaryUrls = deletedHotelPhotosUrlsArray.map(
      (url) => url.match(regex)[1]
    );

    // Delete from Cloudinary
    await Promise.all(
      cloudinaryUrls.map(async (url) => {
        await cloudinary.uploader.destroy(url, {
          resource_type: 'image',
        });
      })
    );

    const isUpdateSuccess = await updateHotelPhotos(
      JSON.stringify(oldImageUrlsArray),
      hotelId
    );
    if (isUpdateSuccess) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addRoomPhotos = async (req, res) => {
  try {
    const { roomId, hotelId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing files' });
    }

    // Process each uploaded image
    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const timestamp = new Date()
          .toISOString()
          .replace(/[^a-zA-Z0-9_\\-]/g, '-');

        // Convert image to AVIF using sharp
        const avifBuffer = await sharp(file.buffer)
          .avif({ quality: 50 }) // Adjust quality as needed
          .toBuffer();

        // Upload AVIF to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: 'image',
                public_id: `hotels/${hotelId}/rooms/${roomId}/${timestamp}`,
              },
              (error, result) => {
                if (error) {
                  console.error('Error uploading to Cloudinary:', error);
                  return reject(error);
                }
                resolve(result);
              }
            )
            .end(avifBuffer);
        });

        return { url: result.secure_url };
      })
    );

    // update room photo urls
    const oldImageUrls = await Rooms.findOne({
      where: {
        room_id: roomId,
      },
      attributes: ['image_urls'],
    });
    const oldImageUrlsArray = JSON.parse(oldImageUrls.image_urls);
    processedFiles.forEach((file) => {
      oldImageUrlsArray.push(file.url);
    });

    const isUpdateSuccess = await updateRoomPhotos(
      JSON.stringify(oldImageUrlsArray),
      roomId
    );
    if (isUpdateSuccess) {
      res.status(200).json({ files: processedFiles });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error in addRoomPhotos:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addHotelPhotos = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      res.status(400).json({ success: false, message: 'Missing hotel id' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing files' });
    }

    // Process each uploaded image
    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const timestamp = new Date()
          .toISOString()
          .replace(/[^a-zA-Z0-9_\\-]/g, '-');

        // Convert image to AVIF using sharp
        const avifBuffer = await sharp(file.buffer)
          .avif({ quality: 50 }) // Adjust quality as needed
          .toBuffer();

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: 'image',
                public_id: `hotels/${hotelId}/${timestamp}`,
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            )
            .end(avifBuffer);
        });

        return { url: result.secure_url };
      })
    );

    // update room photo urls
    const oldImageUrls = await Hotels.findOne({
      where: {
        hotel_id: hotelId,
      },
      attributes: ['image_urls'],
    });
    const oldImageUrlsArray = JSON.parse(oldImageUrls.image_urls);
    processedFiles.forEach((file) => {
      oldImageUrlsArray.push(file.url);
    });

    const isUpdateSuccess = await updateHotelPhotos(
      JSON.stringify(oldImageUrlsArray),
      hotelId
    );
    if (isUpdateSuccess) {
      res.status(200).json({ files: processedFiles });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateRoomPhotos = async (newImageUrls, roomId) => {
  try {
    await Rooms.update(
      {
        image_urls: newImageUrls,
      },
      {
        where: {
          room_id: roomId,
        },
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

const updateHotelPhotos = async (newImageUrls, hotelId) => {
  try {
    await Hotels.update(
      {
        image_urls: newImageUrls,
      },
      {
        where: {
          hotel_id: hotelId,
        },
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

// room amenities
const getAllRoomAmenities = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing roomId' });
    }
    const rooms = await Rooms.findAll({
      where: {
        hotel_id: hotelId,
      },
      attributes: ['room_id', 'room_name', 'room_amenities', 'room_size'],
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateRoomAmenities = async (req, res) => {
  try {
    const { rooms } = req.body;
    if (!rooms || rooms.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing roomId' });
    }

    for (const room of rooms) {
      await RoomInventories.update(
        {
          room_amenities: room.room_amenities,
          room_size: room.room_size,
        },
        {
          where: {
            room_id: room.room_id,
          },
        }
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// room inventory
const getRoomInventory = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing roomId' });
    }
    const roomInventories = await RoomInventories.findAll({
      where: {
        room_id: roomId,
      },
    });
    res.status(200).json(roomInventories);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateRoomInventory = async (req, res) => {
  try {
    const { newRoomInventory } = req.body;
    if (newRoomInventory.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing newRoomInventory' });
    }

    for (let i = 0; i < newRoomInventory.length; i++) {
      const room = newRoomInventory[i];
      await RoomInventories.create(
        {
          status: room.status,
          price_per_night: room.price_per_night,
          total_reserved: room.total_reserved,
        },
        {
          where: {
            room_id: room.room_id,
            date: room.date.split('T')[0],
          },
        }
      );
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
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
