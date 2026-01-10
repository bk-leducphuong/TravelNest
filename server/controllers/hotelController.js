const sequelize = require('../config/db');

const getHotelDetails = async (req, res) => {
  const {
    hotelId,
    checkInDate,
    checkOutDate,
    numberOfDays,
    numberOfRooms,
    numberOfGuests,
  } = req.body;

  try {
    const hotelQuery = `
            SELECT hotel_id, name, description, address, city, phone_number, overall_rating,
            latitude, longitude, image_urls, hotel_class, 
            hotel_amenities, check_in_time, check_out_time
            FROM hotels WHERE hotel_id = ?
        `;

    const roomQuery = `
        SELECT 
            r.room_id,
            r.room_name, 
            r.max_guests,
            r.image_urls AS room_image_urls, 
            r.room_amenities, 
            ri.price_per_night, 
            ri.available_rooms
        FROM rooms AS r
        JOIN (
            SELECT 
                ri.room_id,
                SUM(ri.price_per_night) AS price_per_night,
                MIN(ri.total_inventory - ri.total_reserved) AS available_rooms
            FROM room_inventory AS ri
            WHERE 
                ri.date BETWEEN ? AND ?
                AND ri.status = 'open'
            GROUP BY ri.room_id
            HAVING COUNT(CASE WHEN ri.total_inventory - ri.total_reserved >= ? THEN 1 END) = ?
        ) AS ri ON r.room_id = ri.room_id
        JOIN hotels AS h ON h.hotel_id = r.hotel_id
        WHERE h.hotel_id = ?
        AND r.max_guests >= ?;
          `;

    const reviewsQuery = `
          SELECT rv.review_id, rv.user_id, rv.rating, rv.comment, rv.created_at, rv.booking_code, users.username, users.profile_picture_url, users.country
          FROM reviews rv 
          JOIN users ON users.user_id = rv.user_id
          WHERE rv.hotel_id = ?;
        `;

    const nearbyPlacesQuery = `
            SELECT place_id, place_name, latitude AS place_latitude, longitude AS place_longitude 
            FROM nearby_places WHERE hotel_id = ?
        `;

    //TODO: delete review breakdown table, use new review_criterias table
    const reviewCriteriasQuery = `
      SELECT
          rc.criteria_name, r.hotel_id,
          AVG(rc.score) AS average_score
      FROM
          review_criterias rc
      JOIN
          reviews r ON rc.review_id = r.review_id
      WHERE
          r.hotel_id = ?
      GROUP BY
          rc.criteria_name;
    `;

    const [hotel, rooms, reviews, nearbyPlaces, reviewCriterias] =
      await Promise.all([
        await sequelize.query(hotelQuery, {
          replacements: [hotelId],
          type: sequelize.QueryTypes.SELECT,
        }),
        await sequelize.query(roomQuery, {
          replacements: [
            checkInDate,
            checkOutDate,
            numberOfRooms,
            numberOfDays,
            hotelId,
            numberOfGuests,
          ],
          type: sequelize.QueryTypes.SELECT,
        }),
        await sequelize.query(reviewsQuery, {
          replacements: [hotelId],
          type: sequelize.QueryTypes.SELECT,
        }),
        await sequelize.query(nearbyPlacesQuery, {
          replacements: [hotelId],
          type: sequelize.QueryTypes.SELECT,
        }),
        await sequelize.query(reviewCriteriasQuery, {
          replacements: [hotelId],
          type: sequelize.QueryTypes.SELECT,
        }),
      ]);

    //TODO: get booking details for each review
    //...

    res.json({
      hotel: hotel[0], // chỉ trả về bản ghi đầu tiên vì thông tin khách sạn là duy nhất
      rooms,
      reviews,
      nearbyPlaces: nearbyPlaces,
      reviewCriterias: reviewCriterias,
    });
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
  }
};

const searchRoom = async (req, res) => {
  try {
    const {
      hotel_id,
      checkInDate,
      checkOutDate,
      numberOfDays,
      adults,
      children,
      rooms,
    } = req.body;

    const total_guests = parseInt(adults, 10) + parseInt(children, 10);

    const query = `
            SELECT 
            r.room_id,
            r.room_name, 
            r.max_guests,
            r.image_urls AS room_image_urls, 
            r.room_amenities, 
            ri.price_per_night, 
            ri.available_rooms
        FROM rooms AS r
        JOIN (
            SELECT 
                ri.room_id,
                SUM(ri.price_per_night) AS price_per_night,
                MIN(ri.total_inventory - ri.total_reserved) AS available_rooms
            FROM room_inventory AS ri
            WHERE 
                ri.date BETWEEN ? AND ?
                AND ri.status = 'open'
            GROUP BY ri.room_id
            HAVING COUNT(CASE WHEN ri.total_inventory - ri.total_reserved >= ? THEN 1 END) = ?
        ) AS ri ON r.room_id = ri.room_id
        JOIN hotels AS h ON h.hotel_id = r.hotel_id
        WHERE h.hotel_id = ?
        AND r.max_guests >= ?;
            `;
    const available_rooms = await sequelize.query(query, {
      replacements: [
        checkInDate,
        checkOutDate,
        rooms,
        numberOfDays,
        hotel_id,
        total_guests,
      ],
      type: sequelize.QueryTypes.SELECT,
    });

    if (available_rooms && available_rooms.length === 0) {
      return res.status(200).json({
        success: false,
        available_rooms: [],
        message: 'No hotels found matching the criteria',
      });
    }

    res.status(200).json({ success: true, available_rooms: available_rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      available_rooms: [],
      message: 'Internal Server Error',
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

    const rooms = await sequelize.query(query, {
      replacements: [
        bookingInfor.hotel.hotel_id,
        bookingInfor.numberOfGuests,
        bookingInfor.checkInDate,
        bookingInfor.checkOutDate,
        bookingInfor.numberOfDays,
      ],
      type: sequelize.QueryTypes.SELECT,
    });

    bookingInfor.selectedRooms.forEach((selectedRoom) => {
      const room = rooms.find((room) => room.room_id === selectedRoom.room_id);
      if (room) {
        room.available_rooms >= selectedRoom.roomQuantity;
      } else {
        return res.status(200).json({ isAvailable: false });
      }
    });

    return res.status(200).json({ isAvailable: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

module.exports = { getHotelDetails, searchRoom, checkRoomAvailability };
