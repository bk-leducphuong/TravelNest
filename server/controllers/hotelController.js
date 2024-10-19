const connection = require('../config/db');
const { promisify } = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getSearchHotels = async (req, res) => {
    try {
        const { place, from, to, adults, children, rooms, has_pet } = req.body;

        // Input validation (can be enhanced further)
        if (!place || !from || !to || !adults || !rooms) {
            return res.status(400).json({ success: false, message: 'Missing search informations' });
        }

        // query database
        const query = `
            SELECT * FROM hotels 
            WHERE city = ? 
              AND available_from <= ? 
              AND available_to >= ? 
              AND room_count >= ? 
              AND has_pets = ?
              AND max_adults >= ?
              AND max_children >= ?
        `;
        const queryParams = [place, from, to, rooms, has_pet === 'true', adults, children || 0];

        // Execute the query
        const results = await queryAsync(query, queryParams);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No hotels found for the specified criteria' });
        }

        // Respond with the search results
        res.json({ success: true, data: results });

    } catch (error) {
        console.error('Error during hotel search:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const getHotel = (req, res) => {
// get hotel's informations with specific id
}

module.exports = { getSearchHotels, getHotel };
