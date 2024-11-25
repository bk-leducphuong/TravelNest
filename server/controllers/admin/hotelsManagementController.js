const connection = require('../../config/db');
const { promisify } = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getAllManagingHotels = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const managingHotels = await queryAsync('SELECT * FROM hotels WHERE owner_id = ?', [userId]);
        res.status(200).json({ managingHotels });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllManagingHotels
}