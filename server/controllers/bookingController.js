const connection = require('../config/db');
const { promisify } = require('util');
// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getAllBookings = async (req, res) => {
    try {
        const buyerId = req.session.user.user_id;
        //TODO: update booking status
        //...
        
        const query = 'SELECT * FROM bookings WHERE buyer_id = ? ORDER BY created_at DESC';
        const bookings = await queryAsync(query, [buyerId]);

        for (let booking of bookings) {
            const hotelId = booking.hotel_id;
            const query2 = 'SELECT name, city, image_urls FROM hotels WHERE hotel_id = ?';
            const hotelInformation = await queryAsync(query2, [hotelId]);
            booking.hotel = hotelInformation[0];

            const roomId = booking.room_id;
            const query3 = 'SELECT room_name FROM rooms WHERE room_id = ?';
            const roomInformation = await queryAsync(query3, [roomId]);
            booking.roomName = roomInformation[0].room_name;
        }
        res.status(200).json({bookings: bookings});
    }catch(error) {
        console.log(error)
    }
}

module.exports = {
    getAllBookings,
}