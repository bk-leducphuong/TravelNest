const connection = require('../config/db');
const redisClient = require('../config/redis')
const {promisify} = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

// get recent viewed hotels
const getRecentViewHotels = async (req, res) => {
    const user_id = req.session.user.user_id;

    const query = `
        SELECT hotel_id
        FROM viewed_hotels
        WHERE user_id = ?
        LIMIT 10; `;

    const results = await queryAsync(query, [user_id]);
    if (results.length < 0) {
        return res.status(400).json({ success: false});
    }
    res.status(200).json(results); 
}

const getRecentSearchs = async (req, res) => {
    const user_id = req.session.user.user_id;

    const query = `
        SELECT location, booking_schedule, booking_options
        FROM search_logs
        WHERE user_id = ?
        LIMIT 10; `;

    const results = await queryAsync(query, [user_id]);
    if (results.length < 0) {
        return res.status(400).json({ success: false});
    }
    res.status(200).json(results); 
}

// get top 10 most searched places 
const getPopularPlaces = async (req, res) => {
    try {
        // Check Redis cache for popular places (using Promise to handle Redis client)
        const cachedPopularPlaces = await redisClient.get('popular_places');

        if (cachedPopularPlaces) {
            // Return cached data if it exists
            return res.json(JSON.parse(cachedPopularPlaces));
        }

        // If cache miss, query the database
        const query = `
            SELECT location, COUNT(*) AS search_count
            FROM search_logs
            GROUP BY location
            ORDER BY search_count DESC
            LIMIT 10;
        `;

        // Query the database
        const results = await queryAsync(query);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No popular places found' });
        }

        // Store results in Redis with TTL (1 hour)
        await redisClient.set('popular_places', JSON.stringify(results), 'EX', 3600);

        // Return the results
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {getRecentViewHotels, getRecentSearchs, getPopularPlaces};