const connection = require("../../config/db");
const { promisify } = require("util");

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
}

const deleteRoomPhotos = async (req, res) => {
  try {
    const { roomId, imageUrls } = req.body;
    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing roomId" });
    }
    const query = `UPDATE rooms SET image_urls = ? WHERE room_id = ?`;
    await queryAsync(query, [imageUrls, roomId]);
    res.status(200).json({ success: true });
  } catch (error) {
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
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
    const {newRoomInventory} = req.body;
    if (newRoomInventory.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing newRoomInventory" });
    }
    const query = `UPDATE room_inventory SET status = ?, price_per_night = ?, total_reserved = ? WHERE room_id = ? AND date = ?`;

    for(let i = 0; i < newRoomInventory.length; i++) {
      const room = newRoomInventory[i];
      await queryAsync(query, [
        room.status,
        room.price_per_night,
        room.total_reserved,
        room.room_id,
        room.date.split('T')[0]
      ]);
    }
    res.status(200).json({ success: true });
  }catch(error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getAllRooms,
  getAllRoomPhotos,
  deleteRoomPhotos,
  deleteHotelPhotos,
  getRoomInventory,
  updateRoomInventory,
};
