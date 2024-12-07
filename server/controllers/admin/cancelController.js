const connection = require("../../config/db");
const { promisify } = require("util");
const transporter = require("../../config/nodemailer");
const { init, getIO } = require("../../config/socket");
const fs = require("fs");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

// send email to who booked the reservation
const sendCancelEmail = async (bookingInformation) => {
  try {
    const {
        booking_code: bookingCode,
        buyer_id: buyerId,
        rooms,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        bookedOn,
        totalPrice,
        bookerInformation,
    } = bookingInformation;

    let bookedRoom = ''
    rooms.forEach(room => {
        bookedRoom += room.roomInformation.room_name + ', '
    });
    // Load the email template
    const templatePath = "./email-templates/cancelBooking.html";
    let emailTemplate = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders with actual booking details
    emailTemplate = emailTemplate
      .replace("{{bookingCode}}", bookingCode)
      .replace("{{username}}", bookerInformation.username)
      .replace("{{email}}", bookerInformation.email)
      .replace("{{checkInDate}}", checkInDate)
      .replace("{{checkOutDate}}", checkOutDate)
      .replace("{{numberOfGuests}}", numberOfGuests)
      .replace("{{bookedRooms}}", bookedRoom)

    // Email options
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: bookerInformation.email, // Recipient's email address
      subject: "Booking Cancellation",
      html: emailTemplate, // HTML content
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const handleCancel = async (req, res) => {
  try {
    const { bookingInformation } = req.body;

    if (!bookingInformation) {
      return res
        .status(400)
        .json({ success: false, message: "Booking code is required" });
    }

    const bookingCode = bookingInformation.booking_code;

    const query =
      "SELECT charge_id, amount FROM transactions WHERE booking_code = ?";
    const result = await queryAsync(query, [bookingCode]);
    const chargeId = result[0].charge_id;
    const amount = parseInt(result[0].amount);

    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: amount,
    });

    // send email to who booked the reservation
    await sendCancelEmail(bookingInformation);

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

module.exports = { handleCancel };
