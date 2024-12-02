const { type } = require("os");
const connection = require("../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getHotelDetails = async (req, res) => {
  const { hotelId, checkInDate, checkOutDate, numberOfDays, numberOfRooms, numberOfGuests } = req.body;

  try {
    const hotelQuery = `
            SELECT name, description, address, city, phone_number, overall_rating,
            latitude, longitude, image_urls AS hotel_image_urls, hotel_class, 
            hotel_amenities, check_in_time, check_out_time
            FROM hotels WHERE hotel_id = ?
        `;

    const roomQuery = `
          SELECT 
          MIN(ri.total_inventory - ri.total_reserved) AS available_rooms,
            r.room_id,
            r.room_name, r.price_per_night, r.max_guests,
          r.image_urls AS room_image_urls, r.room_amenities 
          FROM hotels h
          JOIN rooms r 
              ON h.hotel_id = r.hotel_id
          JOIN room_inventory ri 
              ON r.room_id = ri.room_id
          WHERE h.hotel_id = ?
            AND r.max_guests >= ?
            AND ri.date BETWEEN ? AND ?
          GROUP BY r.room_id
        HAVING COUNT(CASE WHEN ri.total_inventory - ri.total_reserved >= ? THEN 1 END) = ?;
        `;

    const reviewsQuery = `
          SELECT rv.review_id, rv.user_id, rv.rating, rv.comment, rv.created_at, users.username
          FROM reviews rv 
          JOIN users ON users.user_id = rv.user_id
          WHERE rv.hotel_id = ?;
        `;

    const nearbyPlacesQuery = `
            SELECT place_id, place_name, latitude AS place_latitude, longitude AS place_longitude 
            FROM nearby_places WHERE hotel_id = ?
        `;

    const reviewsBreakdownQuery = `
            SELECT review_id, hotel_id, category_name, total_mentioned, positive, negative, neutral 
            FROM reviews_breakdown WHERE hotel_id = ?
        `;

    const [hotel, rooms, reviews, nearbyPlaces, reviewsBreakdown] =
      await Promise.all([
        queryAsync(hotelQuery, [hotelId]),
        queryAsync(roomQuery, [hotelId, numberOfGuests, checkInDate, checkOutDate, numberOfRooms, numberOfDays]),
        queryAsync(reviewsQuery, [hotelId]),
        queryAsync(nearbyPlacesQuery, [hotelId]),
        queryAsync(reviewsBreakdownQuery, [hotelId]),
      ]);

    res.json({
      hotel: hotel[0], // chỉ trả về bản ghi đầu tiên vì thông tin khách sạn là duy nhất
      rooms,
      reviews,
      nearby_places: nearbyPlaces,
      reviews_breakdown: reviewsBreakdown,
    });
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại sau." });
  }
};

const searchRoom = async (req, res) => {
  try {
    const { hotel_id, checkInDate, checkOutDate, numberOfDays, adults, children, rooms } = req.body;
    
    const total_guests = parseInt(adults, 10) + parseInt(children, 10);

    const query = `
            SELECT 
          MIN(ri.total_inventory - ri.total_reserved) AS available_rooms,
            r.room_id,
            r.room_name, r.price_per_night, r.max_guests,
          r.image_urls AS room_image_urls, r.room_amenities 
        FROM hotels h
        JOIN rooms r 
            ON h.hotel_id = r.hotel_id
        JOIN room_inventory ri 
            ON r.room_id = ri.room_id
        WHERE h.hotel_id = ?
          AND r.max_guests >= ?
          AND ri.date BETWEEN ? AND ?
        GROUP BY r.room_id
        HAVING COUNT(CASE WHEN ri.total_inventory - ri.total_reserved >= ? THEN 1 END) = ?;
            `;
    // Thực hiện truy vấn
    const available_rooms = await queryAsync(query, [
      hotel_id,
      total_guests, // total_guests
      checkInDate,
      checkOutDate,
      rooms,
      numberOfDays
    ]);
    if (available_rooms.length === 0) {
      return res.status(200).json({
        success: false,
        available_rooms: [],
        message: "No hotels found matching the criteria",
      });
    }

    res.status(200).json({ success: true, available_rooms: available_rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      available_rooms: [],
      message: "Internal Server Error",
    });
  }
};

const checkRoomAvailability = async (req, res) => {
  try {
    const { bookingInfor } = req.body;
    const query = `
      SELECT 
        MIN(ri.total_inventory - ri.total_reserved) AS available_rooms,
        r.room_id
      FROM hotels h
      JOIN rooms r 
      ON h.hotel_id = r.hotel_id
      JOIN room_inventory ri 
      ON r.room_id = ri.room_id
      WHERE h.hotel_id = ?
      AND r.max_guests >= ?
      AND ri.date BETWEEN ? AND ?
      GROUP BY  r.room_id
      HAVING COUNT(CASE WHEN ri.total_inventory - ri.total_reserved >= 0 THEN 1 END) = ?;
    `;

    const rooms = await queryAsync(query, [
      bookingInfor.hotel.hotel_id,
      bookingInfor.numberOfGuests,
      bookingInfor.checkInDate,
      bookingInfor.checkOutDate,
      bookingInfor.numberOfDays
    ]);

    bookingInfor.selectedRooms.forEach(selectedRoom => {
      const room = rooms.find(room => room.room_id === selectedRoom.room_id);
      if (room) {
        room.available_rooms >= selectedRoom.roomQuantity;
      }else {
        return res.status(200).json({ isAvailable: false });
      }
    });

    return res.status(200).json({ isAvailable: true });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { getHotelDetails, searchRoom, checkRoomAvailability };
