const connection = require('../config/db');
const { promisify } = require('util');

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
            SELECT review_id, user_id, rating, comment, created_at 
            FROM reviews WHERE hotel_id = ?
        `;

        const nearbyPlacesQuery = `
            SELECT place_id, place_name, latitude AS place_latitude, longitude AS place_longitude 
            FROM nearby_places WHERE hotel_id = ?
        `;

        const reviewsBreakdownQuery = `
            SELECT review_id, hotel_id, category_name, total_mentioned, positive, negative, neutral 
            FROM reviews_breakdown WHERE hotel_id = ?
        `;

        const [hotel, rooms, reviews, nearbyPlaces, reviewsBreakdown] = await Promise.all([
            queryAsync(hotelQuery, [hotelId]),
            queryAsync(roomQuery, [hotelId]),
            queryAsync(reviewsQuery, [hotelId]),
            queryAsync(nearbyPlacesQuery, [hotelId]),
            queryAsync(reviewsBreakdownQuery, [hotelId])
        ]);

        res.json({
            hotel: hotel[0],  // chỉ trả về bản ghi đầu tiên vì thông tin khách sạn là duy nhất
            rooms,
            reviews,
            nearby_places: nearbyPlaces,
            reviews_breakdown: reviewsBreakdown
        });
    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
    }
};


module.exports = { getHotelDetails };
