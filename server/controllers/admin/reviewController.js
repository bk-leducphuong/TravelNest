const connection = require("../../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getAllReviews = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing hotelId" });
    }
    const reviews = await queryAsync(
      `SELECT * FROM reviews WHERE hotel_id = ?`,
      [hotelId]
    );

    for (const review of reviews) {
      // get user name and email for each review
      const user = await queryAsync(
        `SELECT username, email FROM users WHERE user_id = ?`,
        [review.user_id]
      );
      review.user_name = user[0].username;
      review.user_email = user[0].email;
      // get reivew criteria
      const criteria = await queryAsync(
        `SELECT criteria_name, score FROM review_criterias WHERE review_id = ?`,
        [review.review_id]
      );
      review.review_criteria = criteria;
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const postReview = async (req, res) => {
  try {
    const { userId, hotelId, rating, comment } = req.body;
    if (!userId || !hotelId || !rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const query = `
      INSERT INTO reviews (user_id, hotel_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;
    await queryAsync(query, [userId, hotelId, rating, comment]);
    res
      .status(201)
      .json({ success: true, message: "Review posted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const replyToReview = async (req, res) => {
  try {
    const { reviewId, reply } = req.body;
    if (!reviewId || !reply) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const query = `
      UPDATE reviews SET reply = ? WHERE review_id = ?
    `;
    await queryAsync(query, [reply, reviewId]);
    res
      .status(201)
      .json({ success: true, message: "Reply posted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAllReviews, postReview, replyToReview };
