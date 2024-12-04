require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connection = require("../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const handleCancel = async (req, res) => {
  const { bookingCode } = req.body;

  if (!bookingCode) {
    return res.status(400).json({ success: false, message: "Booking code is required" });
  }

  try {
    const query =
      "SELECT charge_id, amount FROM transactions WHERE booking_code = ?";
    const result = await queryAsync(query, [bookingCode]);
    const chargeId = result[0].charge_id;
    const amount = parseInt(result[0].amount);

    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: amount,
    });
   
    return res.status(200).json({
      success: true,
      message: "Refund successful",
    });
  } catch (error) {
    console.error("Refund failed:", error);
    return res.status(500).json({
      message: "Refund failed",
      error: error.message,
    });
  }
};

module.exports = {
  handleCancel,
};
