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
const sendCancelEmail = async (bookingInformation, hotelInformation) => {
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

const sendCancelBookingNotification = async (bookingInformation, hotelInformation) => {
  const io = getIO();

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

  const {
    hotel_id: hotelId,
    name: hotelName,
  } = hotelInformation

  // create notification
  const notification = {
    senderId: hotelId,
    recieverId: buyerId, 
    notificationType: "cancel booking",
    message: `Cancel booking: ${hotelName} has cancelled your booking with booking code is ${bookingCode}.`,
    isRead: 0,
  };

  // store notification
  const notificationQuery = `
      INSERT INTO user_notifications (sender_id, reciever_id, notification_type, message, is_read)
      VALUES (?, ?, ?, ?, ?)
    `;
    const { insertId: notificationId } = await queryAsync(notificationQuery, [
      notification.senderId,
      notification.recieverId,
      notification.notificationType,
      notification.message,
      notification.isRead,
    ]);

  io.to(`user_${notification.recieverId}`).emit("newNotification", {
    notification_id: notificationId,
    notification_type: notification.notificationType,
    message: notification.message,
    is_read: notification.isRead,
    sender_id: notification.senderId,
  });

  // io.to(`owner_${notification.recieverId}`).emit("newNotification", {
  //   notificationId: notificationId,
  //   notificationType: notification.notificationType,
  //   message: 'Bạn đã hủy đơn đặt phòng thành công!',
  //   isRead: notification.isRead,
  //   senderId: notification.senderId,
  // });
};


const handleCancel = async (req, res) => {
  try {
    const { bookingInformation, hotelInformation } = req.body;

    if (!bookingInformation || !hotelInformation) {
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
    await sendCancelEmail(bookingInformation, hotelInformation);

    // send notification to use who booked the reservation
    await sendCancelBookingNotification(bookingInformation, hotelInformation);

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
