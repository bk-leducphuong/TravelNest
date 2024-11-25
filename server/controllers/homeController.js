const connection = require("../config/db");
const redisClient = require("../config/redis");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const postRecentViewedHotels = async (req, res) => {
  try {
    const user_id = req.session.user.userid;
    //const user_id = 1;
    const { hotel_id } = req.body;
    if (!hotel_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing hotel_id" });
    }
    // xóa nếu trùng
    const deleteQuery = `
        DELETE FROM viewed_hotels
        WHERE user_id = ? AND hotel_id = ?;
    `;

    await queryAsync(deleteQuery, [user_id, hotel_id]);
    // giới hạn
    const countQuery = `
    SELECT COUNT(*) AS count FROM search_logs;
`;
    const result = await queryAsync(countQuery);
    const count = result[0].count;

    // Nếu tổng số bản ghi lớn hơn hoặc bằng 10, xóa bản ghi cũ nhất
    if (count >= 10) {
      const deleteOldestQuery = `
        DELETE FROM search_logs
        ORDER BY search_time ASC
        LIMIT 1;
    `;
      await queryAsync(deleteOldestQuery);
    }
    const query = `
            INSERT INTO viewed_hotels (user_id, hotel_id, viewed_at)
            VALUES (?, ?, NOW());`;
    await queryAsync(query, [user_id, hotel_id]);

    res
      .status(201)
      .json({ success: true, message: "Hotel view recorded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// get recent viewed hotels
const getRecentViewedHotels = async (req, res) => {
  const user_id = req.session.user.user_id;
  //const user_id = 1;
  const query = `
        SELECT hotel_id
        FROM viewed_hotels
        WHERE user_id = ?
        LIMIT 10; `;

  const results = await queryAsync(query, [user_id]);
  if (results.length == 0) {
    return res
      .status(200)
      .json({ success: false, message: "No recent viewed hotels" });
  }
  res.status(200).json(results);
};

// save recent seaches
const postRecentSearchs = async (req, res) => {
  try {
    const user_id = req.session.user.user_id;
    
    const { location, dateRange, adults, children, rooms } = req.body;
    if (!location || !dateRange || !adults || !children || !rooms) {
      return res
        .status(400)
        .json({ success: false, message: "Missing search details" });
    }
    // xóa nếu trùng
    const deleteQuery = `
        DELETE FROM search_logs
        WHERE user_id = ? AND location = ? AND dateRange =?;
    `;
    await queryAsync(deleteQuery, [user_id, location, dateRange]);
    // giới hạn
    const countQuery = `
            SELECT COUNT(*) AS count FROM viewed_hotels;
        `;
    const result = await queryAsync(countQuery);
    const count = result[0].count;

    // Nếu tổng số bản ghi lớn hơn hoặc bằng 10, xóa bản ghi cũ nhất
    if (count >= 10) {
      const deleteOldestQuery = `
                DELETE FROM viewed_hotels
                ORDER BY viewed_at ASC
                LIMIT 1;
            `;
      await queryAsync(deleteOldestQuery);
    }
    const query = `
        INSERT INTO search_logs (location, user_id, search_time, children, adults,rooms, dateRange)
            VALUES (?, ?, NOW(), ?, ?,?,?);`;

    // Thực hiện truy vấn
    await queryAsync(query, [
      location,
      user_id,
      children,
      adults,
      rooms,
      dateRange,
    ]);

    // Trả về phản hồi thành công
    res
      .status(201)
      .json({ success: true, message: "Search log recorded successfully" });
  } catch (error) {
    // Xử lý lỗi
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getRecentSearchs = async (req, res) => {
  const user_id = req.session.user.user_id;

  const query = `
        SELECT location, dateRange, adults, children, rooms
        FROM search_logs
        WHERE user_id = ?
        LIMIT 10; `;

  const results = await queryAsync(query, [user_id]);
  if (results.length < 0) {
    return res.status(400).json({ success: false });
  }
  res.status(200).json(results);
};

// get top 10 most searched places
const getPopularPlaces = async (req, res) => {
  try {
    // Check Redis cache for popular places (using Promise to handle Redis client)
    const cachedPopularPlaces = await redisClient.get("popular_places");

    if (cachedPopularPlaces) {
      // Return cached data if it exists
      return res.json({popular_places: JSON.parse(cachedPopularPlaces)});
    }

    // If cache miss, query the database
    const query = `
            SELECT location, COUNT(*) AS search_count
            FROM search_logs
            GROUP BY location
            ORDER BY search_count DESC
            LIMIT 5;
        `;

    // Query the database
    const results = await queryAsync(query);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, popular_places: [], message: "No popular places found" });
    }

    // Store results in Redis with TTL (1 hour)
    await redisClient.set("popular_places", JSON.stringify(results), {
      EX: 60 * 60 * 24,
    });

    // Return the results
    res.json({popular_places: results});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get nearby hotels based on location (latitude, longitude)
const getNearByHotels = async (req, res) => {
  const { location } = req.body; // location.longitude, location.latitude

  if (!location) {
    return res.status(400).json({
      success: false,
      message: "Longitude and latitude are required.",
    });
  }
  const { latitude, longitude } = location;

  // Define the search radius (in kilometers)
  const searchRadius = 6; // Example: find hotels within 10 kilometers

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
      return res
        .status(200)
        .json({ success: false, hotels: [], message: "No nearby hotels found." });
    }

    // Return the list of nearby hotels
    res.json({ success: true, hotels: results });
  } catch (error) {
    console.error("Error fetching nearby hotels:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getRecentViewedHotels,
  getRecentSearchs,
  getPopularPlaces,
  getNearByHotels,
  postRecentSearchs,
  postRecentViewedHotels,
};
