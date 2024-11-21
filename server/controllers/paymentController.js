require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connection = require("../config/db");
const { promisify } = require("util");
const transporter = require("../config/nodemailer");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const handlePayment = async (req, res) => {
  try {
    const { paymentMethodId, amount, currency, bookingDetails } = req.body;
    const buyer_id = req.session.user.user_id;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: "http://localhost:5173/book/complete",
      metadata: {
        hotel_id: bookingDetails.hotel_id, // Add hotel_id into metadata
        buyer_id: buyer_id, // Add seller_id into metadata
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



module.exports = { handlePayment };
