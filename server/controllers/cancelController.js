require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connection = require("../config/db");
const { promisify } = require("util");
const { getIO } = require("../config/socket");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const sendCancelBookingNotification = async (bookingInformation) => {
  try {
    const io = getIO();

    const {
      booking_code: bookingCode,
      buyerId,
      rooms,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      bookedOn,
      totalPrice,
      hotel,
    } = bookingInformation;

    const { name: hotelName, hotel_id: hotelId } = hotel;

    // get buyer name
    const buyerQuery = `
    SELECT username FROM users WHERE user_id = ?
  `;
    const buyer = await queryAsync(buyerQuery, [buyerId]);
    const buyerName = buyer[0].username;

    // get total number of rooms
    let totalRooms = 0;
    JSON.parse(rooms).forEach((room) => {
      totalRooms += room.quantity;
    });

    // send cancel booking notification for owner hotel
    const adminNotification = {
      senderId: buyerId,
      recieverId: hotelId, // hotel  id
      notificationType: "cancel booking",
      message: `Cancel booking: ${buyerName} has cancelled ${totalRooms} rooms from ${new Date(
        checkInDate
      ).toDateString()} to ${new Date(
        checkOutDate
      ).toDateString()} for ${numberOfGuests} guests.`,
      isRead: 0,
    };

    const notificationQuery = `
      INSERT INTO notifications (sender_id, reciever_id, notification_type, message, is_read)
      VALUES (?, ?, ?, ?, ?)
    `;
    const { insertId: notificationId } = await queryAsync(notificationQuery, [
      adminNotification.senderId,
      adminNotification.recieverId,
      adminNotification.notificationType,
      adminNotification.message,
      adminNotification.isRead,
    ]);

    io.to(`owner_${adminNotification.recieverId}`).emit("newNotification", {
      notification_id: notificationId,
      notification_type: adminNotification.notificationType,
      message: adminNotification.message,
      is_read: adminNotification.isRead,
      sender_id: adminNotification.senderId,
    });

    // send cancel booking notification for user who book the reservation
    const userNotification = {
      senderId: 0, // system,
      recieverId: buyerId,
      notificationType: "cancel booking",
      message: `Bạn đã hủy đặt phòng ở khách sạn ${hotelName} thành công!`,
      isRead: 0,
    };

    const userNotificationQuery = `
      INSERT INTO user_notifications (sender_id, reciever_id, notification_type, message, is_read)
      VALUES (?, ?, ?, ?, ?)
    `;
    const { insertId: userNotificationId } = await queryAsync(
      userNotificationQuery,
      [
        userNotification.senderId,
        userNotification.recieverId,
        userNotification.notificationType,
        userNotification.message,
        userNotification.isRead,
      ]
    );

    io.to(`user_${buyerId}`).emit("newNotification", {
      notification_id: userNotificationId,
      notification_type: userNotification.notificationType,
      message: userNotification.message,
      is_read: userNotification.isRead,
      sender_id: userNotification.senderId,
    });
  } catch (error) {
    console.error(error);
  }
};

const handleCancel = async (req, res) => {
  const { bookingInformation } = req.body;
  const buyerId = req.session.user.user_id;
  bookingInformation.buyerId = buyerId;

  if (!bookingInformation) {
    return res
      .status(400)
      .json({ success: false, message: "Booking code is required" });
  }

  try {
    const query =
      "SELECT charge_id, amount FROM transactions WHERE booking_code = ?";
    const result = await queryAsync(query, [bookingInformation.booking_code]);
    const chargeId = result[0].charge_id;
    const amount = parseInt(result[0].amount);

    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: amount,
    });

    await sendCancelBookingNotification(bookingInformation);

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
