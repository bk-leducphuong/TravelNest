const connection = require('../../config/db')
const {promisify} = require('util')

const queryAsync = promisify(connection.query).bind(connection)

const getTotalBookings = async (req, res) => {
    try {
        const { period, hotelId } = req.body
        const query = `SELECT COUNT(*) as total_bookings FROM bookings WHERE hotel_id = ? AND created_at BETWEEN ? AND ? `;
        const results = await queryAsync(query, [hotelId, period.start, period.end])
        res.status(200).json({totalBookings: results[0].total_bookings})
    }catch(error) {
        console.log(error)
        res.status(500).json({message: 'Internal Server Error'})
    }
}

module.exports = {
    getTotalBookings
}