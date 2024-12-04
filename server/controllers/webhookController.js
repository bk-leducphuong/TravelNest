require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connection = require("../config/db");
const { promisify } = require("util");
const transporter = require("../config/nodemailer");
const { init, getIO } = require("../config/socket");
const { v4: uuidv4 } = require("uuid");
const { send } = require("process");
const path = require("path");
const fs = require("fs");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

/******************************************* Utility Functions **********************************************/
async function getSellerId(paymentIntent) {
  try {
    const sellerQuery = "SELECT owner_id FROM hotels WHERE hotel_id = ?";
    const hotelId = paymentIntent.metadata.hotel_id; // Lấy từ metadata của Payment Intent
    const sellerResult = await queryAsync(sellerQuery, [hotelId]);
    const sellerId = sellerResult[0]?.owner_id;
    return sellerId;
  } catch (error) {
    console.error(error);
  }
}

async function getTransactionId(paymentIntentId) {
  const query =
    "SELECT transaction_id FROM transactions WHERE payment_intent_id = ?";
  const result = await queryAsync(query, [paymentIntentId]);
  return result[0]?.transaction_id || null;
}

function convertDateStringToDate(dateString) {
  const dateParts = dateString.match(/(\d{2}\/\d{2}\/\d{4})/g);
  if (dateParts && dateParts.length === 2) {
    const [startDateStr, endDateStr] = dateParts;

    // Chuyển đổi chuỗi sang đối tượng Date
    const startDate = new Date(startDateStr.split("/").reverse().join("-")); // YYYY-MM-DD
    const endDate = new Date(endDateStr.split("/").reverse().join("-"));

    return { startDate, endDate };
  }
}

/******************************************* Storing Bookings **********************************************/
const storeBooking = async (paymentIntent) => {
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

  const bookedRooms = JSON.parse(booked_rooms);
  bookedRooms.forEach(async (bookedRoom) => {
    // Insert a new booking with status "pending"
    const bookingQuery = `
    INSERT INTO bookings (buyer_id, check_in_date, check_out_date, total_price, status, number_of_guests, quantity, hotel_id, room_id, booking_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const { insertId: bookingId } = await queryAsync(bookingQuery, [
      buyerId,
      checkInDate,
      checkOutDate,
      paymentIntent.amount, // price for all booked rooms
      "confirmed",
      numberOfGuests,
      bookedRoom.roomQuantity,
      hotelId,
      bookedRoom.room_id,
      bookingCode,
    ]);
  });
};

const storeInvoice = async (paymentIntent) => {
  const { hotel_id: hotelId, booking_code: bookingCode } =
    paymentIntent.metadata;

  const transactionId = await getTransactionId(paymentIntent.id);

  const invoiceQuery = `
      INSERT INTO invoices (transaction_id, hotel_id ,status, amount, created_at, booking_code)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  await queryAsync(invoiceQuery, [
    transactionId,
    hotelId,
    "unavailable",
    paymentIntent.amount,
    new Date(),
    bookingCode,
  ]);
};


/******************************************* Storing Payment and Transaction events **********************************************/

const handlePaymentIntentCreated = async (paymentIntent) => {
  try {
    const { buyer_id: buyerId, hotel_id: hotelId, booking_code: bookingCode } = paymentIntent.metadata;
    //const sellerId = await getSellerId(paymentIntent);
    const paymentMethodId = paymentIntent.payment_method;
    const paymentMethod = paymentMethodId
      ? await stripe.paymentMethods.retrieve(paymentMethodId)
      : null;

    const currency = paymentIntent.currency.toUpperCase();

    const transactionQuery = `
      INSERT INTO Transactions (buyer_id, hotel_id, amount, currency, status, transaction_type, payment_intent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const { insertId: transactionId } = await queryAsync(transactionQuery, [
      buyerId,
      hotelId,
      paymentIntent.amount,
      currency,
      "pending",
      "booking_payment",
      paymentIntent.id,
    ]);

    const paymentQuery = `
      INSERT INTO Payments (transaction_id, payment_method, payment_status, amount, currency, paid_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await queryAsync(paymentQuery, [
      transactionId,
      paymentMethod ? paymentMethod.type : "unknown",
      "pending",
      paymentIntent.amount,
      currency,
      new Date(),
    ]);
  } catch (error) {
    console.error("Error handling payment intent created:", error);
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

    const checkTransactionQuery = `
      SELECT transaction_id FROM Transactions WHERE payment_intent_id = ?
    `;
    const transactionExists = await queryAsync(checkTransactionQuery, [
      paymentIntent.id,
    ]);

    if (transactionExists.length > 0) {
      const transactionId = transactionExists[0].transaction_id;

      const updateTransactionQuery = `
        UPDATE Transactions SET status = ?, charge_id = ?, booking_code = ? WHERE transaction_id = ?
      `;
      await queryAsync(updateTransactionQuery, ["completed",chargeId, bookingCode, transactionId]);

      const updatePaymentQuery = `
        UPDATE Payments SET payment_status = ?, payment_method = ? WHERE transaction_id = ?
      `;
      await queryAsync(updatePaymentQuery, [
        "success",
        paymentMethod ? paymentMethod.type : "unknown",
        transactionId,
      ]);
    } else {
      console.error(
        "Transaction not found for payment intent:",
        paymentIntent.id
      );
    }
  } catch (error) {
    console.error("Error handling payment intent succeeded:", error);
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

    const transactionQuery = `
      INSERT INTO Transactions (buyer_id, hotel_id, amount, currency, status, transaction_type, payment_intent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const { insertId: transactionId } = await queryAsync(transactionQuery, [
      buyerId,
      hotelId,
      paymentIntent.amount,
      currency,
      "failed",
      "booking_payment",
      paymentIntent.id,
    ]);

    const paymentQuery = `
      INSERT INTO Payments (transaction_id, payment_method, payment_status, amount, currency, paid_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await queryAsync(paymentQuery, [
      transactionId,
      paymentMethod ? paymentMethod.type : "unknown",
      "failed",
      paymentIntent.amount,
      currency,
      new Date(),
    ]);
  } catch (error) {
    console.error("Error handling payment intent created:", error);
    throw error;
  }
};

/******************************************* Refund **********************************************/
const handleRefundIntentSucceeded = async (chargeRefunded) => {
  try {
   const {buyer_id: buyerId, hotel_id: hotelId, booking_code: bookingCode, booked_rooms: bookedRooms, check_in_date: checkInDate, check_out_date: checkOutDate, number_of_guests: numberOfGuests} = chargeRefunded.metadata;
   const chargeId = chargeRefunded.id;
   const amount = chargeRefunded.amount;

   const transactionQuery = `
      SELECT transaction_id FROM Transactions WHERE charge_id = ?
    `;
    const transaction = await queryAsync(transactionQuery, [chargeId]);

   // store refund
   const refundQuery = `
      INSERT INTO refunds ( buyer_id, hotel_id, transaction_id , amount,completed_at,status)
      VALUES (?, ?, ?, ?, ?,?)
    `;
    await queryAsync(refundQuery, [
      buyerId,
      hotelId,
      transaction[0].transaction_id,
      amount,
      new Date(),
      'completed',
    ]);

    // update booking status
    const updateBookingQuery = `
      UPDATE bookings
      SET status = ?
      WHERE booking_code = ?
    `;
    await queryAsync(updateBookingQuery, ['cancelled', bookingCode]);

    // update number of reserved rooms 
    const bookedRoomsArray = JSON.parse(bookedRooms);
    for (const bookedRoom of bookedRoomsArray) {
      const roomQuery = `
        UPDATE room_inventory
        SET total_reserved = total_reserved - ?
        WHERE room_id = ? AND date BETWEEN ? AND ? ;
      `;
      await queryAsync(roomQuery, [bookedRoom.roomQuantity, bookedRoom.room_id, checkInDate, checkOutDate]);
    }
    console.log('query successful:');
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
    const templatePath = "./email-templates/thankyou.html";
    let emailTemplate = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders with actual booking details
    emailTemplate = emailTemplate
      // .replace('{{buyerName}}', buyerName)
      // .replace('{{hotelName}}', hotelName)
      .replace('{{bookingCode}}', bookingCode)
      .replace('{{checkInDate}}', (new Date(checkInDate)).toString().split(' ').splice(0, 4).join(' '))
      .replace('{{checkOutDate}}', (new Date(checkOutDate)).toString().split(' ').splice(0, 4).join(' '))
      .replace('{{numberOfGuests}}', numberOfGuests)
      .replace('{{totalPrice}}', parseInt(paymentIntent.amount).toLocaleString('vi-VN'))

    // Email options
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: paymentIntent.receipt_email, // Recipient's email address
      subject: "Booking Confirmation",
      html: emailTemplate, // HTML content
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/******************************************* Notification **********************************************/
// store notification
async function storeNotification(notification) {
  const { senderId, recieverId, notificationType, message, isRead } =
    notification;
  try {
    const notificationQuery = `
      INSERT INTO notifications (sender_id, reciever_id, notification_type, message, is_read)
      VALUES (?, ?, ?, ?, ?)
    `;
    const { insertId: notificationId } = await queryAsync(notificationQuery, [
      senderId,
      recieverId,
      notificationType,
      message,
      isRead,
    ]);
    return notificationId;
  } catch (error) {
    console.error("Error storing notification:", error);
    throw error;
  }
}
// payment event handler for socket io
async function sendNewBookingNotification(paymentIntent) {
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
  const buyerQuery = `
    SELECT username FROM users WHERE user_id = ?
  `;
  const buyer = await queryAsync(buyerQuery, [buyerId]);
  const buyerName = buyer[0].username;
  // get total number of rooms
  let totalRooms = 0;
  JSON.parse(booked_rooms).forEach((bookedRoom) => {
    totalRooms += bookedRoom.roomQuantity;
  });

  // create notification
  const notification = {
    senderId: buyerId,
    recieverId: hotelId, // hotel  id
    notificationType: "booking",
    message: `New booking: ${buyerName} booked ${totalRooms} rooms from ${checkInDate} to ${checkOutDate} for ${numberOfGuests} guests.`,
    isRead: false,
  };

  // store notification
  const notificationId = await storeNotification(notification);

  io.to(`owner_${notification.recieverId}`).emit("newNotification", {
    notificationId: notificationId,
    notificationType: notification.notificationType,
    message: notification.message,
    isRead: notification.isRead,
    senderId: notification.senderId,
  });
}
/******************************************* Room inventory **********************************************/
const updateRoomInventory = async (paymentIntent) => {
  const {
    booked_rooms: bookedRooms,
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
  } = paymentIntent.metadata;
  const bookedRoomsArray = JSON.parse(bookedRooms);
  for (const bookedRoom of bookedRoomsArray) {
    const roomQuery = `
      UPDATE room_inventory
      SET total_reserved = total_reserved + ?
      WHERE room_id = ? AND date BETWEEN ? AND ? ;
    `;
    await queryAsync(roomQuery, [
      bookedRoom.roomQuantity,
      bookedRoom.room_id,
      checkInDate,
      checkOutDate,
    ]);
  }
};

/******************************************* Payout Event **********************************************/
const handlePayoutEvent = async (payout, status) => {
  try {
    const payoutId = payout.id;

    // Update the cashout status based on the event

    const transactionID = payout.metadata.transaction_id;

    // update status of invoice
    const updateInvoiceQuery = `
      UPDATE invoices
      SET status = ?, updated_at = NOW()
      WHERE transaction_id = ?
    `;
    await queryAsync(updateInvoiceQuery, ["done", transactionID]);
    // await queryAsync(updateInvoiceQuery, ['done', transactionId]);
    if (status === "failed") {
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
    const sig = req.headers["stripe-signature"];
    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  // Handle specific event types
  try {
    const io = getIO();
    const paymentIntent = event.data.object;

    switch (event.type) {
      case "payment_intent.created":
        await handlePaymentIntentCreated(paymentIntent);
        break;

      case "payment_intent.succeeded":
        const paymentMethodId = paymentIntent.payment_method;
        const paymentMethod = paymentMethodId
          ? await stripe.paymentMethods.retrieve(paymentMethodId)
          : null;

        let receiptEmail = null; // Biến để lưu email người nhận

        if (paymentMethodId) {
          try {
            const paymentMethod = await stripe.paymentMethods.retrieve(
              paymentMethodId
            );
            receiptEmail = paymentMethod.billing_details.email;
          } catch (err) {
            console.error("Error retrieving payment method:", err.message);
          }
        } else {
          console.log("No payment method provided in this event.");
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
            console.error("Error sending confirmation email:", err.message);
          }
        } else {
          console.log("No email provided for this payment.");
        }
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event, paymentIntent);
        // You could add failed payment notification logic here
        break;

      // cases for payout
      case "payout.paid":
        const payoutPaid = event.data.object;
        await handlePayoutEvent(payoutPaid, "completed");
        //TODO: send notification to hotel owner
        io.to(`owner_${payoutPaid.metadata.hotel_id}`).emit(
          "payout-completed",
          {
            transactionId: payoutPaid.metadata.transaction_id,
          }
        );
        break;

      case "payout.failed":
        const failedPayout = event.data.object;
        await handlePayoutEvent(failedPayout, "failed");
        //TODO: send notification to hotel owner
        io.to(`owner_${failedPayout.metadata.hotel_id}`).emit("payout-failed", {
          transactionId: failedPayout.metadata.transaction_id,
        });
        break;
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
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
};
module.exports = { webhookController };
