require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
        booking_code: bookingDetails.bookingCode,
        hotel_id: bookingDetails.hotel_id, // Add hotel_id into metadata
        buyer_id: buyer_id, // Add buyer_id into metadata
        booked_rooms: JSON.stringify(bookingDetails.bookedRooms),
        check_in_date: bookingDetails.checkInDate,
        check_out_date: bookingDetails.checkOutDate,
        number_of_guests: bookingDetails.numberOfGuests
      },
    });
    // store chargeId into transaction

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
};

module.exports = { handlePayment };
