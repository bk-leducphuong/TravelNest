const connection = require("../../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getAllBookings = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const bookings = await queryAsync(
      "SELECT * FROM bookings WHERE hotel_id = ?",
      [hotelId]
    );

    res.status(200).json({ bookings: bookings });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllBookings,
};
