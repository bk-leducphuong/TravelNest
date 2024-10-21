const connection = require('../config/db');
const redisClient = require('../config/redis')
const {promisify} = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const postRecentViewHotels = (req, res) => {
    // save recently viewed hotels
}

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

const postRecentSearchs = (req, res) => {
    // save recent seaches

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

// Get nearby hotels based on location (latitude, longitude)
const getNearByHotels = async (req, res) => {
    const { location } = req.body; // location.longitude, location.latitude
    const { longitude, latitude } = location;

    // Validate that both longitude and latitude are provided
    if (!longitude || !latitude) {
        return res.status(400).json({ success: false, message: 'Longitude and latitude are required.' });
    }

    // Define the search radius (in kilometers)
    const searchRadius = 5; // Example: find hotels within 10 kilometers

    // MySQL query to find hotels within the radius using the Haversine formula
    const query = `
        SELECT *, 
        (
            6371 * acos(
                cos(radians(?)) * cos(radians(latitude)) * 
                cos(radians(longitude) - radians(?)) + 
                sin(radians(?)) * sin(radians(latitude))
            )
        ) AS distance
        FROM hotels
        HAVING distance < ?
        ORDER BY distance ASC;
    `;
    
    // Query parameters (latitude, longitude, latitude again for the Haversine formula, and the search radius)
    const queryParams = [latitude, longitude, latitude, searchRadius];

    try {
        // Execute the query
        const results = await queryAsync(query, queryParams);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No nearby hotels found.' });
        }

        // Return the list of nearby hotels
        res.json({ success: true, data: results });

    } catch (error) {
        console.error('Error fetching nearby hotels:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};


module.exports = {getRecentViewHotels, getRecentSearchs, getPopularPlaces, getNearByHotels, postRecentSearchs, postRecentViewHotels};