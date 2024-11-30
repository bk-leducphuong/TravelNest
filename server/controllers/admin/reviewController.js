const connection = require('../../config/db');
const { promisify } = require('util');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getReviews = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing hotelId' });
    }
    const reviews = await queryAsync(
      `SELECT * FROM reviews WHERE hotel_id = ?`,
      [hotelId]
    );
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const postReview = async (req, res) => {
  try {
    const { userId, hotelId, rating, comment } = req.body;
    if (!userId || !hotelId || !rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }
    const query = `
      INSERT INTO reviews (user_id, hotel_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;
    await queryAsync(query, [userId, hotelId, rating, comment]);
    res.status(201).json({ success: true, message: 'Review posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getReviews, postReview };