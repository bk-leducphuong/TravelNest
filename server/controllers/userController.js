const connection = require("../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getUserInformation = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const userQuery = `SELECT user_id, user_role, username, email, full_name, phone_number, address, country, profile_picture_url FROM users WHERE user_id = ?`;
        const user = await queryAsync(userQuery, [userId]);
        res.status(200).json({ success: true, user: user[0] });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getUserInformation
}