require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getIO } = require("../config/socket");
const sequelize = require("../config/db");
const { Op, Sequelize, DataTypes } = require("sequelize");
const Users = require("../models/users")(sequelize, DataTypes);
const Notifications = require("../models/notifications")(sequelize, DataTypes);
const UserNotifications = require("../models/user_notifications")(
  sequelize,
  DataTypes
);
const Transactions = require("../models/transactions")(sequelize, DataTypes);

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
    const buyer = await Users.findOne({
      where: { user_id: buyerId },
      attributes: ["username"],
    });
    const buyerName = buyer.username;

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

    const notification = await Notifications.create({
      sender_id: adminNotification.senderId,
      reciever_id: adminNotification.recieverId,
      notification_type: adminNotification.notificationType,
      message: adminNotification.message,
      is_read: adminNotification.isRead,
    });
    const notificationId = notification.notification_id;

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

    const userNotificationResult = await UserNotifications.create({
      sender_id: userNotification.senderId,
      reciever_id: userNotification.recieverId,
      notification_type: userNotification.notificationType,
      message: userNotification.message,
      is_read: userNotification.isRead,
    });
    const userNotificationId = userNotificationResult.notification_id;

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
    const transaction = await Transactions.findOne({
      where: { booking_code: bookingInformation.booking_code },
      attributes: ['charge_id', 'amount']
    });
    const chargeId = transaction.charge_id;
    const amount = parseInt(transaction.amount);

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
