const connection = require('../config/db');
const { promisify } = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getHotelDetails = async (req, res) => {
    // get hotel's informations with specific id
    try {
        const hotel_id = req.params.hotel_id

        const query = 'SELECT * FROM hotels WHERE hotel_id = ?'

        const hotelDetails = await queryAsync(query, [hotel_id]);
        res.status(200).json(hotelDetails)
    }catch(error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { getHotelDetails };
