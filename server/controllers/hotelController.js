const connection = require('../config/db');
const { promisify } = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getHotelDetails = async (req, res) => {
    // Get hotelId from URL parameters
    const hotelId = req.params.hotelId;
    console.log('Hotel ID:', hotelId); // Kiểm tra xem hotelId có được nhận đúng không

    try {
        // Lấy thông tin chi tiết của khách sạn
        const hotelQuery = `
            SELECT name, description, address, city, phone_number, overall_rating, latitude, longitude, 
                   image_urls, hotel_class, hotel_amenities, check_in_time, check_out_time
            FROM hotels 
            WHERE hotel_id = ?
        `;
        const hotel = await queryAsync(hotelQuery, [hotelId]);
        
        if (hotel.length === 0) {
            return res.status(404).json({ message: 'Khách sạn không tồn tại.' });
        }

        // Lấy thông tin về các phòng của khách sạn
        const roomQuery = `
        SELECT room_id, room_name, price_per_night, max_guests, total_rooms, booked_rooms, image_urls, room_amenities
        FROM rooms 
        WHERE hotel_id = ?
    `;
        const rooms = await queryAsync(roomQuery, [hotelId]);

        // Lấy các đánh giá của khách hàng về khách sạn
        const reviewsQuery = `
            SELECT user_id,review_id,  hotel_id,rating,comment,created_at
            FROM reviews 
            WHERE hotel_id = ?
        `;
        const reviews = await queryAsync(reviewsQuery, [hotelId]);

        

        // Lấy các địa điểm gần nhất về khách sạn
        const nearbyplacesQuery = `
            SELECT place_id, hotel_id, place_name, latitude,longitude
            FROM nearby_places 
            WHERE hotel_id = ?
        `;
        const nearby_places = await queryAsync(nearbyplacesQuery, [hotelId]);

        // Lấy các đánh giá breakdown    về khách sạn
        const reviews_breakdownQuery = `
            SELECT *
            FROM reviews_breakdown 
            WHERE hotel_id = ?
        `;
        const reviews_breakdown = await queryAsync(reviews_breakdownQuery, [hotelId]);



        // Gửi thông tin về khách sạn, các phòng, và đánh giá
        res.json({
            hotel: hotel[0],  // Thông tin khách sạn (lấy phần tử đầu tiên trong mảng)
            rooms: rooms,     // Thông tin phòng
            reviews: reviews,  // Đánh giá khách hàng
            nearby_hotels: nearby_places,
            reviews_breakdown :reviews_breakdown
        });

    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
    }
}

module.exports = { getHotelDetails };
