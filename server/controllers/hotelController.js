const connection = require('../config/db');
const { promisify } = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getHotel = (req, res) => {
// get hotel's informations with specific id
}

module.exports = { getHotel };
