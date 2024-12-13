const connection = require("../config/db");
const { promisify } = require("util");
const { post } = require("../routes/reviewRoutes");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const validateUser = async (req, res) => {
  try {
    const buyerId = req.session.user.user_id;
    const { bookingCode } = req.body;
    if (!bookingCode) {
      return res
        .status(400)
        .json({ success: false, message: "Missing bookingCode" });
    }
    const query = `
      SELECT booking_code FROM bookings WHERE booking_code = ? AND buyer_id = ?
    `;
    const booking = await queryAsync(query, [bookingCode, buyerId]);
    if (booking.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, bookingCode: bookingCode });
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

const getAllReviews = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    // get all completed bookings of user
    const bookingQuery = `SELECT DISTINCT hotel_id, booking_code FROM bookings WHERE buyer_id = ? AND status = 'completed'`;
    const bookings = await queryAsync(bookingQuery, [userId]);

    for (const booking of bookings) {
      // get hotel name
      const hotelQuery = `SELECT name, image_urls FROM hotels WHERE hotel_id = ?`;
      const hotel = await queryAsync(hotelQuery, [booking.hotel_id]);
      booking.hotel = hotel[0]
      // get review
      const reviewQuery = `
        SELECT review_id, rating, comment, created_at, reply, number_of_likes, number_of_dislikes
        FROM reviews 
        WHERE booking_code = ?;
      `;

      const review = await queryAsync(reviewQuery, [booking.booking_code]);
      booking.review = review;
    }

    res.status(200).json({reviews: bookings});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { validateUser, postReview, getAllReviews };
