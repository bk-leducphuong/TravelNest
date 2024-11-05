const connection = require('../config/db');
const { promisify } = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getHotelDetails = async (req, res) => {
    const hotelId = req.params.hotelId;

    try {
        const hotelQuery = `
            SELECT 
                h.name, h.description, h.address, h.city, h.phone_number, h.overall_rating, 
                h.latitude, h.longitude, h.image_urls AS hotel_image_urls, h.hotel_class, 
                h.hotel_amenities, h.check_in_time, h.check_out_time,
                r.room_id, r.room_name, r.price_per_night, r.max_guests, 
                r.total_rooms, r.booked_rooms, r.image_urls AS room_image_urls, r.room_amenities,
                rv.user_id, rv.review_id, rv.rating, rv.comment, rv.created_at,
                np.place_id, np.place_name, np.latitude AS place_latitude, np.longitude AS place_longitude,
                rb.*
            FROM hotels h
            LEFT JOIN rooms r ON h.hotel_id = r.hotel_id
            LEFT JOIN reviews rv ON h.hotel_id = rv.hotel_id
            LEFT JOIN nearby_places np ON h.hotel_id = np.hotel_id
            LEFT JOIN reviews_breakdown rb ON h.hotel_id = rb.hotel_id
            WHERE h.hotel_id = ?
        `;

        const results = await queryAsync(hotelQuery, [hotelId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Khách sạn không tồn tại.' });
        }

        // Tạo các cấu trúc dữ liệu để trả về cho API
        const hotelInfo = {
            name: results[0].name,
            description: results[0].description,
            address: results[0].address,
            city: results[0].city,
            phone_number: results[0].phone_number,
            overall_rating: results[0].overall_rating,
            latitude: results[0].latitude,
            longitude: results[0].longitude,
            image_urls: results[0].hotel_image_urls,
            hotel_class: results[0].hotel_class,
            hotel_amenities: results[0].hotel_amenities,
            check_in_time: results[0].check_in_time,
            check_out_time: results[0].check_out_time
        };

        const rooms = [];
        const reviews = [];
        const nearby_places = [];
        const reviews_breakdown = [];

        // Phân loại kết quả thành các phần khác nhau
        results.forEach(row => {
            // Thêm các phòng vào mảng rooms nếu chưa có
            if (row.room_id && !rooms.some(room => room.room_id === row.room_id)) {
                rooms.push({
                    room_id: row.room_id,
                    room_name: row.room_name,
                    price_per_night: row.price_per_night,
                    max_guests: row.max_guests,
                    total_rooms: row.total_rooms,
                    booked_rooms: row.booked_rooms,
                    image_urls: row.room_image_urls,
                    room_amenities: row.room_amenities
                });
            }
        
            // Thêm các đánh giá vào mảng reviews nếu chưa có
            if (row.review_id && !reviews.some(review => review.review_id === row.review_id)) {
                reviews.push({
                    user_id: row.user_id,
                    review_id: row.review_id,
                    rating: row.rating,
                    comment: row.comment,
                    created_at: row.created_at
                });
            }
        
            // Thêm các địa điểm vào mảng nearby_places nếu chưa có
            if (row.place_id && !nearby_places.some(place => place.place_id === row.place_id)) {
                nearby_places.push({
                    place_id: row.place_id,
                    place_name: row.place_name,
                    latitude: row.place_latitude,
                    longitude: row.place_longitude
                });
            }
        
            // Thêm các mục từ reviews_breakdown
            if (row.category_name) {
                reviews_breakdown.push({
                    review_id: row.review_id,
                    hotel_id: row.hotel_id,
                    category_name: row.category_name,
                    total_mentioned: row.total_mentioned,
                    positive: row.positive,
                    negative: row.negative,
                    neutral: row.neutral
                });
            }

            
        });

        console.log(reviews_breakdown.length)

        res.json({
            hotel: hotelInfo,
            rooms,
            reviews,
            nearby_hotels: nearby_places,
            reviews_breakdown
        });

    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
    }
};

module.exports = { getHotelDetails };
