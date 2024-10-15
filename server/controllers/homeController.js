const connection = require('../config/db');
const redisClient = require('../config/redis')
const {promisify} = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

// get recent viewed hotels
const getRecentViewHotels = async (req, res) => {
    const {user_id} = req.body;

    const query = `
        SELECT hotel_id
        FROM viewed_hotels
        WHERE user_id = ?
        LIMIT 10; `;

    const results = await queryAsync(query, [user_id]);
    if (results.length < 0) {
        return res.status(400).json({ success: false});
    }
    res.status(200).json(results[0]); 
}

const getRecentSearchs = async (req, res) => {
    const {user_id} = req.body;

    const query = `
        SELECT location, booking_schedule, booking_options
        FROM search_logs
        WHERE user_id = ?
        LIMIT 10; `;

    const results = await queryAsync(query, [user_id]);
    if (results.length < 0) {
        return res.status(400).json({ success: false});
    }
    res.status(200).json(results[0]); 
}

// get top 10 most searched places 
const getPopularPlaces = async (req, res) => {
    redisClient.get('popular_places', async (err, cachedPopularPlaces) => {
        if (cachedPopularPlaces) {
            // Return from cache
            return res.json(JSON.parse(cachedPopularPlaces));
        }

        // If cache miss, query the database
        const query = `
        SELECT location, COUNT(*) AS search_count
        FROM search_logs
        GROUP BY location
        ORDER BY search_count DESC
        LIMIT 10;  -- Get top 10 most searched places
        `;

        const results = await queryAsync(query);
        if (results.length < 0) {
            return res.status(400).json({ success: false});
        }

        // Store in Redis with TTL (e.g., cache for 1 hour)
        redisClient.setex('popular_places', 3600, JSON.stringify(results[0]));

        res.json(results[0]); // return 
    });
}

module.exports = {getRecentViewHotels, getRecentSearchs, getPopularPlaces};