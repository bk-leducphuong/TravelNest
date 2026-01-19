const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Op } = require('sequelize');
const transporter = require('@config/nodemailer');
const { getIO } = require('@socket/index');
const fs = require('fs');
const {
  transactions: Transactions,
  bookings: Bookings,
  invoices: Invoices,
  payments: Payments,
  refunds: Refunds,
  room_inventories: RoomInventories,
  users: Users,
  notifications: Notifications,
  user_notifications: UserNotifications,
} = require('@models/index');

/******************************************* Utility Functions **********************************************/
async function getTransactionId(paymentIntentId) {
  const transaction = await Transactions.findOne({
    where: { payment_intent_id: paymentIntentId },
  });
  return transaction.transaction_id;
}

/******************************************* Storing Bookings **********************************************/
const storeBooking = async (paymentIntent) => {
  const {
    hotel_id: hotelId,
    buyer_id: buyerId,
    booked_rooms,
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
    number_of_guests: numberOfGuests,
    booking_code: bookingCode,
  } = paymentIntent.metadata;

  const bookedRooms = JSON.parse(booked_rooms);
  bookedRooms.forEach(async (bookedRoom) => {
    await Bookings.create({
      buyer_id: buyerId,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      total_price: paymentIntent.amount, // price for all booked rooms
      status: 'confirmed',
      number_of_guests: numberOfGuests,
      quantity: bookedRoom.roomQuantity,
      hotel_id: hotelId,
      room_id: bookedRoom.room_id,
      booking_code: bookingCode,
    });
  });
};

const storeInvoice = async (paymentIntent) => {
  const { hotel_id: hotelId, booking_code: bookingCode } =
    paymentIntent.metadata;

  const transactionId = await getTransactionId(paymentIntent.id);
  await Invoices.create({
    transaction_id: transactionId,
    hotel_id: hotelId,
    status: 'unavailable',
    amount: paymentIntent.amount,
    created_at: new Date(),
    booking_code: bookingCode,
  });
};

/******************************************* Storing Payment and Transaction events **********************************************/

const handlePaymentIntentCreated = async (paymentIntent) => {
  try {
    const {
      buyer_id: buyerId,
      hotel_id: hotelId,
      booking_code: bookingCode,
    } = paymentIntent.metadata;
    //const sellerId = await getSellerId(paymentIntent);
    const paymentMethodId = paymentIntent.payment_method;
    const paymentMethod = paymentMethodId
      ? await stripe.paymentMethods.retrieve(paymentMethodId)
      : null;

    const currency = paymentIntent.currency.toUpperCase();

    await Transactions.create({
      buyer_id: buyerId,
      hotel_id: hotelId,
      amount: paymentIntent.amount,
      currency: currency,
      status: 'pending',
      transaction_type: 'booking_payment',
      payment_intent_id: paymentIntent.id,
    });

    await Payments.create({
      transaction_id: transactionId,
      payment_method: paymentMethod ? paymentMethod.type : 'unknown',
      payment_status: 'pending',
      amount: paymentIntent.amount,
      currency: currency,
      paid_at: new Date(),
    });
  } catch (error) {
    console.error('Error handling payment intent created:', error);
    throw error;
  }
};
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    const paymentMethodId = paymentIntent.payment_method;
    const bookingCode = paymentIntent.metadata.booking_code;
    // Lấy Charge ID
    const chargeId = paymentIntent.latest_charge;
    const paymentMethod = paymentMethodId
      ? await stripe.paymentMethods.retrieve(paymentMethodId)
      : null;

    const transaction = await Transactions.findOne({
      where: { payment_intent_id: paymentIntent.id },
    });

    if (transaction) {
      const transactionId = transaction.transaction_id;

      await Transactions.update(
        { status: 'completed', charge_id: chargeId, booking_code: bookingCode },
        { where: { transaction_id: transactionId } }
      );
      await Payments.update(
        { payment_status: 'success', payment_method: paymentMethod.type },
        { where: { transaction_id: transactionId } }
      );
    } else {
      console.error(
        'Transaction not found for payment intent:',
        paymentIntent.id
      );
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
    throw error;
  }
};
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const { buyer_id: buyerId, hotel_id: hotelId } = paymentIntent.metadata;
    //const sellerId = await getSellerId(paymentIntent);
    const paymentMethodId = paymentIntent.payment_method;
    const paymentMethod = paymentMethodId
      ? await stripe.paymentMethods.retrieve(paymentMethodId)
      : null;

    const currency = paymentIntent.currency.toUpperCase();

    const transaction = await Transactions.create({
      buyer_id: buyerId,
      hotel_id: hotelId,
      amount: paymentIntent.amount,
      currency: currency,
      status: 'failed',
      transaction_type: 'booking_payment',
      payment_intent_id: paymentIntent.id,
    });

    await Payments.create({
      transaction_id: transaction.transaction_id,
      payment_method: paymentMethod ? paymentMethod.type : 'unknown',
      payment_status: 'failed',
      amount: paymentIntent.amount,
      currency: currency,
      paid_at: new Date(),
    });
  } catch (error) {
    console.error('Error handling payment intent created:', error);
    throw error;
  }
};

/******************************************* Refund **********************************************/
const handleRefundIntentSucceeded = async (chargeRefunded) => {
  try {
    const {
      buyer_id: buyerId,
      hotel_id: hotelId,
      booking_code: bookingCode,
      booked_rooms: bookedRooms,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      number_of_guests: numberOfGuests,
    } = chargeRefunded.metadata;
    const chargeId = chargeRefunded.id;
    const amount = chargeRefunded.amount;

    const transaction = await Transactions.findOne({
      where: { charge_id: chargeId },
    });

    await Refunds.update({
      buyer_id: buyerId,
      hotel_id: hotelId,
      transaction_id: transaction.transaction_id,
      amount: amount,
      completed_at: new Date(),
      status: 'completed',
    });

    // update booking status
    await Bookings.update(
      { status: 'cancelled' },
      { where: { booking_code: bookingCode } }
    );

    // delete invoice
    await Invoices.destroy({
      where: { transaction_id: transaction.transaction_id },
    });

    // update number of reserved rooms
    const bookedRoomsArray = JSON.parse(bookedRooms);
    for (const bookedRoom of bookedRoomsArray) {
      await RoomInventories.update(
        { total_reserved: totalReserved - bookedRoom.roomQuantity },
        {
          where: {
            room_id: bookedRoom.room_id,
            date: {
              [Op.between]: [checkInDate, checkOutDate],
            },
          },
        }
      );
    }
  } catch (error) {
    console.error('Refund failed:', error);
  }
};

/******************************************* Sending Emails **********************************************/
// Email template function
const sendConfirmationEmail = async (paymentIntent) => {
  try {
    const {
      hotel_id: hotelId,
      buyer_id: buyerId,
      seller_id: seller_id,
      booked_rooms,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      number_of_guests: numberOfGuests,
      booking_code: bookingCode,
    } = paymentIntent.metadata;
    //TODO: get hotel name, get buyer name
    //...

    // Load the email template
    const templatePath = './email-templates/thankyou.html';
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual booking details
    emailTemplate = emailTemplate
      // .replace('{{buyerName}}', buyerName)
      // .replace('{{hotelName}}', hotelName)
      .replace('{{bookingCode}}', bookingCode)
      .replace('{{checkInDate}}', new Date(checkInDate).toDateString())
      .replace('{{checkOutDate}}', new Date(checkOutDate).toDateString())
      .replace('{{numberOfGuests}}', numberOfGuests)
      .replace(
        '{{totalPrice}}',
        parseInt(paymentIntent.amount).toLocaleString('vi-VN')
      );

    // Email options
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: paymentIntent.receipt_email, // Recipient's email address
      subject: 'Booking Confirmation',
      html: emailTemplate, // HTML content
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

/******************************************* Notification **********************************************/
// store notification
async function storeAdminNotification(notification) {
  const { senderId, recieverId, notificationType, message, isRead } =
    notification;
  try {
    const notification = await Notifications.create({
      sender_id: senderId,
      reciever_id: recieverId,
      notification_type: notificationType,
      message: message,
      is_read: isRead,
    });
    return notification.id;
  } catch (error) {
    console.error('Error storing notification:', error);
    throw error;
  }
}

async function storeUserNotification(notification) {
  const { senderId, recieverId, notificationType, message, isRead } =
    notification;
  try {
    const userNotification = await UserNotifications.create({
      sender_id: senderId,
      reciever_id: recieverId,
      notification_type: notificationType,
      message: message,
      is_read: isRead,
    });
    return userNotification.notification_id;
  } catch (error) {
    console.error('Error storing notification:', error);
    throw error;
  }
}
// payment event handler for socket io
async function sendNewBookingNotification(paymentIntent) {
  try {
    const io = getIO();

    const {
      hotel_id: hotelId,
      buyer_id: buyerId,
      booked_rooms,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      number_of_guests: numberOfGuests,
    } = paymentIntent.metadata;

    // get buyer name
    const buyer = await Users.findOne({
      where: { id: buyerId },
    });
    const buyerName = buyer.username;
    // get total number of rooms
    let totalRooms = 0;
    JSON.parse(booked_rooms).forEach((bookedRoom) => {
      totalRooms += bookedRoom.roomQuantity;
    });

    // send new booking notification for owner hotel
    const adminNotification = {
      senderId: buyerId,
      recieverId: hotelId, // hotel  id
      notificationType: 'booking',
      message: `New booking: ${buyerName} booked ${totalRooms} rooms from ${new Date(
        checkInDate
      ).toDateString()} to ${new Date(
        checkOutDate
      ).toDateString()} for ${numberOfGuests} guests.`,
      isRead: 0,
    };

    const adminNotificationId = await storeAdminNotification(adminNotification);

    io.to(`owner_${adminNotification.recieverId}`).emit(
      'newAdminNotification',
      {
        notification_id: adminNotificationId,
        notification_type: adminNotification.notificationType,
        message: adminNotification.message,
        is_read: adminNotification.isRead,
        sender_id: adminNotification.senderId,
      }
    );

    // send new booking notification for user who book the reservation
    const userNotification = {
      senderId: 0, // system,
      recieverId: buyerId,
      notificationType: 'booking',
      message: `Bạn đã đặt phòng thành công!`,
      isRead: 0,
    };

    const userNotificationId = await storeUserNotification(userNotification);

    io.to(`user_${buyerId}`).emit('newUserNotification', {
      notification_id: userNotificationId,
      notification_type: userNotification.notificationType,
      message: userNotification.message,
      is_read: userNotification.isRead,
      sender_id: userNotification.senderId,
    });
  } catch (error) {
    console.error(error);
  }
}

const sendPayoutNotification = (payoutIntent, status) => {
  //TODO: send notification to hotel owner
  // switch (status) {
  //   case "completed":
  //     io.to(`owner_${payoutIntent.metadata.hotel_id}`).emit(
  //       "payout-completed",
  //       {
  //         transactionId: payoutIntent.metadata.transaction_id,
  //       }
  //     );
  //     break;
  //   case "failed":
  //     io.to(`owner_${payoutIntent.metadata.hotel_id}`).emit("payout-failed", {
  //       transactionId: payoutIntent.metadata.transaction_id,
  //     });
  //     break;
  //   default:
  //     break;
  // }
};
/******************************************* Room inventory **********************************************/
const updateRoomInventory = async (paymentIntent) => {
  const {
    booked_rooms: bookedRooms,
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
  } = paymentIntent.metadata;
  const bookedRoomsArray = JSON.parse(bookedRooms);
  for (const bookedRoom of bookedRoomsArray) {
    await RoomInventories.update(
      { total_reserved: totalReserved + bookedRoom.roomQuantity },
      {
        where: {
          room_id: bookedRoom.room_id,
          date: {
            [Op.between]: [checkInDate, checkOutDate],
          },
        },
      }
    );
  }
};

/******************************************* Payout Event **********************************************/
const handlePayoutEvent = async (payout, status) => {
  try {
    const payoutId = payout.id;

    // Update the cashout status based on the event

    const transactionID = payout.metadata.transaction_id;

    // update status of invoice
    await Invoices.update(
      { status: 'done', updated_at: new Date() },
      { where: { transaction_id: transactionID } }
    );
    if (status === 'failed') {
      console.error(`Payout failed for payoutId: ${payoutId}`);
      // Optional: Add any retry logic or notifications for failure
    }
  } catch (error) {
    console.error(`Error handling payout event (${status}):`, error);
    throw new Error(`Failed to update database for payout (${status})`);
  }
};

/******************************************* Webhook **********************************************/

// Recieve webhook events
const webhookController = async (req, res) => {
  let event = req.body;

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    const sig = req.headers['stripe-signature'];
    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  // Handle specific event types
  try {
    const io = getIO();
    const paymentIntent = event.data.object;

    switch (event.type) {
      case 'payment_intent.created':
        await handlePaymentIntentCreated(paymentIntent);
        break;

      case 'payment_intent.succeeded':
        const paymentMethodId = paymentIntent.payment_method;
        const paymentMethod = paymentMethodId
          ? await stripe.paymentMethods.retrieve(paymentMethodId)
          : null;

        let receiptEmail = null; // Biến để lưu email người nhận

        if (paymentMethodId) {
          try {
            const paymentMethod =
              await stripe.paymentMethods.retrieve(paymentMethodId);
            receiptEmail = paymentMethod.billing_details.email;
          } catch (err) {
            console.error('Error retrieving payment method:', err.message);
          }
        } else {
          console.log('No payment method provided in this event.');
        }
        // send notification to hotel owner
        await sendNewBookingNotification(paymentIntent);
        // store transaction and payment
        await handlePaymentIntentSucceeded(paymentIntent);
        // store booking
        await storeBooking(paymentIntent);
        // store invoice
        await storeInvoice(paymentIntent);
        // update number of reserved rooms
        await updateRoomInventory(paymentIntent);

        // Send confirmation email
        if (receiptEmail) {
          try {
            // Sử dụng email vừa lấy để gửi email xác nhận
            paymentIntent.receipt_email = receiptEmail;

            await sendConfirmationEmail(paymentIntent);
          } catch (err) {
            console.error('Error sending confirmation email:', err.message);
          }
        } else {
          console.log('No email provided for this payment.');
        }
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event, paymentIntent);
        // You could add failed payment notification logic here
        break;

      // cases for payout
      case 'payout.paid':
        const payoutPaid = event.data.object;
        await handlePayoutEvent(payoutPaid, 'completed');
        sendPayoutNotification(payoutPaid, 'completed');
        break;

      case 'payout.failed':
        const failedPayout = event.data.object;
        await handlePayoutEvent(failedPayout, 'failed');
        sendPayoutNotification(failedPayout, 'failed');
        break;

      // case for cancel booking
      case 'charge.refunded':
        const chargeRefunded = event.data.object;
        // console.log('Charge refunded:', chargeRefunded);
        await handleRefundIntentSucceeded(chargeRefunded);
        break;

      // Add more event types as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
};
module.exports = { webhookController };
