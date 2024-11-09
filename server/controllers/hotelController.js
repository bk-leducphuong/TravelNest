const { type } = require("os");
const connection = require("../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getHotelDetails = async (req, res) => {
  const hotelId = req.params.hotelId;

  try {
    const hotelQuery = `
            SELECT name, description, address, city, phone_number, overall_rating,
            latitude, longitude, image_urls AS hotel_image_urls, hotel_class, 
            hotel_amenities, check_in_time, check_out_time
            FROM hotels WHERE hotel_id = ?
        `;

    const roomQuery = `
            SELECT room_id, room_name, price_per_night, max_guests, total_rooms, 
            booked_rooms, image_urls AS room_image_urls, room_amenities 
            FROM rooms WHERE hotel_id = ?
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
        queryAsync(roomQuery, [hotelId]),
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
    const { hotel_id, dateRange, adults, children, rooms } = req.body;
    
    if (!hotel_id || !dateRange || !adults || !children || !rooms) {
      return res
        .status(400)
        .json({ success: false, message: "Missing search criteria" });
    }
    // Tổng số khách cần lưu trú
    const total_guests = parseInt(adults, 10) + parseInt(children, 10);

    // Tách chuỗi dateRange
    const datePattern = /Từ (\d{2}\/\d{2}\/\d{4}) đến (\d{2}\/\d{2}\/\d{4})/;
    const match = dateRange.match(datePattern);

    if (!match) {
      return res
        .status(400)
        .json({ success: false, available_rooms: [], message: "Invalid date range format" });
    }
    const check_in_parts = match[1].split("/");
    const check_out_parts = match[2].split("/");

    const check_in = new Date(
      check_in_parts[2],
      check_in_parts[1] - 1,
      check_in_parts[0]
    ); // YYYY, MM, DD
    const check_out = new Date(
      check_out_parts[2],
      check_out_parts[1] - 1,
      check_out_parts[0]
    ); // YYYY, MM, DD

    const query = `
            SELECT DISTINCT r.room_id, r.max_guests, r.booked_rooms, r.total_rooms, r.image_urls, r.room_amenities, r.price_per_night, r.room_name
            FROM rooms r
            INNER JOIN hotels ON r.hotel_id = hotels.hotel_id
            JOIN room_availability ra ON r.room_id = ra.room_id
            WHERE hotels.hotel_id = ?
            AND r.max_guests >= ?
            AND (r.total_rooms - r.booked_rooms) >= ?
            AND ra.available_from <= ?
            AND ra.available_to >= ?;`;
    // Thực hiện truy vấn
    const available_rooms = await queryAsync(query, [
      hotel_id,
      total_guests,
      rooms,
      check_in,
      check_out,
    ]);
    if (available_rooms.length === 0) {
      return res.status(200).json({
        success: false,
        available_rooms: [],
        message: "No hotels found matching the criteria",
      });
    }

    res.status(200).json({ success: true, available_rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, available_rooms: [], message: "Internal Server Error" });
  }
};

module.exports = { getHotelDetails, searchRoom };
