require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connection = require("../config/db");
const { promisify } = require("util");
const transporter = require("../config/nodemailer");
const { init, getIO } = require("../config/socket");
const { v4: uuidv4 } = require('uuid');
const { send } = require("process");
const path = require('path');
const fs = require('fs');

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
    booked_rooms,
    date_range: dateRange,
    number_of_guests: numberOfGuests,
  } = paymentIntent.metadata;

  const { startDate, endDate } = convertDateStringToDate(dateRange);

  const bookingCode = uuidv4(); 

  const bookedRooms = JSON.parse(booked_rooms)
  bookedRooms.forEach(async (bookedRoom) => {
    // Insert a new booking with status "pending"
    const bookingQuery = `
    INSERT INTO bookings (buyer_id, check_in_date, check_out_date, total_price, status, number_of_guests, quantity, hotel_id, room_id, booking_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const { insertId: bookingId } = await queryAsync(bookingQuery, [
      buyerId,
      startDate,
      endDate,
      paymentIntent.amount, // price for all booked rooms
      "confirmed",
      numberOfGuests,
      bookedRoom.roomQuantity,
      hotelId,
      bookedRoom.room_id,
      bookingCode
    ]);
  });

  return bookingCode
};

/******************************************* Storing Payment and Transaction events **********************************************/

const handleNewTransaction = async (
  paymentIntent,
  buyerId,
  sellerId,
  amount,
  currency,
  paymentMethod
) => {
  try {
    const transactionQuery = `
      INSERT INTO Transactions (buyer_id, seller_id, amount, currency, status, transaction_type, payment_intent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const { insertId: transactionId } = await queryAsync(transactionQuery, [
      buyerId,
      sellerId,
      amount,
      currency,
      "pending",
      "booking_payment", // Transaction type
      paymentIntent.id,
    ]);

    const paymentQuery = `
      INSERT INTO Payments (transaction_id, payment_method, payment_status, amount, currency, paid_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await queryAsync(paymentQuery, [
      transactionId,
      paymentMethod,
      "pending",
      amount,
      currency,
      new Date(),
    ]);
  } catch (error) {
    console.error("Error handling new transaction:", error);
    throw error; // Re-throw to propagate errors up
  }
};

const updateExistingTransaction = async (transactionId, paymentMethod) => {
  try {
    const updateTransactionQuery = `
      UPDATE transactions SET status = ? WHERE transaction_id = ? -- Ensure correct column name
    `;
    await queryAsync(updateTransactionQuery, ["completed", transactionId]);

    const updatePaymentQuery = `
      UPDATE payments SET payment_status = ?, payment_method = ? WHERE transaction_id = ?
    `;
    await queryAsync(updatePaymentQuery, [
      "success",
      paymentMethod,
      transactionId,
    ]);
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error; // Re-throw to propagate errors up
  }
};

const storePaymentEvent = async (event, paymentIntent) => {
  try {
    if (!paymentIntent || !paymentIntent.metadata) {
      throw new Error("Invalid paymentIntent or missing metadata");
    }

    const { buyer_id: buyerId } = paymentIntent.metadata;
    const sellerId = await getSellerId(paymentIntent);
    const paymentMethod = paymentIntent.payment_method;
    const amount = paymentIntent.amount / 100;
    const currency = paymentIntent.currency.toUpperCase();

    const checkTransactionQuery = `
      SELECT transaction_id FROM Transactions WHERE payment_intent_id = ?
    `;
    const transactionExists = await queryAsync(checkTransactionQuery, [
      paymentIntent.id,
    ]);

    if (transactionExists.length === 0) {
      await handleNewTransaction(
        paymentIntent,
        buyerId,
        sellerId,
        amount,
        currency,
        paymentMethod
      );
    } else {
      const transactionId = transactionExists[0].id; // Use correct column name
      await updateExistingTransaction(transactionId, paymentMethod);
    }
  } catch (error) {
    console.error("Error storing payment event:", error);
  }
};


/******************************************* Sending Emails **********************************************/
// Email template function
const sendConfirmationEmail = async (paymentIntent, bookingCode) => {
   try {
    // Load the email template
    const templatePath = './email-templates/bookingConfirmation.html';
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual booking details
    emailTemplate = emailTemplate
      .replace('{{bookingCode}}', bookingCode)

    // Email options
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: paymentIntent.receipt_email, // Recipient's email address
      subject: 'Booking Confirmation',
      html: emailTemplate, // HTML content
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// // Utility function to send confirmation emails
// const sendConfirmationEmail = async (paymentIntent) => {
//   try {
//     const { subject, html } = createOrderConfirmationEmail(paymentIntent);

//     await transporter.sendMail({
//       from: process.env.NODEMAILER_EMAIL,
//       to: paymentIntent.receipt_email,
//       subject,
//       html,
//     });
//   } catch (error) {
//     console.error("Error sending confirmation email:", error);
//     throw error;
//   }
// };

/******************************************* Notification **********************************************/
// store notification
async function storeNotification(notification) {
  const {senderId, recieverId, notificationType, message, isRead} = notification;
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
    date_range: dateRange,
    number_of_guests: numberOfGuests,
  } = paymentIntent.metadata;

  // get buyer name
  const buyerQuery = `
    SELECT username FROM users WHERE user_id = ?
  `;
  const buyer = await queryAsync(buyerQuery, [buyerId]);
  // get booking date
  const { startDate, endDate } = convertDateStringToDate(dateRange);
  // get total number of rooms
  let totalRooms = 0;
  JSON.parse(booked_rooms).forEach((bookedRoom) => {
    totalRooms += bookedRoom.roomQuantity;
  })

  // create notification
  const notification = {
    senderId: buyerId,
    recieverId: await getSellerId(paymentIntent), // hotel owner id
    notificationType: "booking",
    message: `New booking: ${buyer} booked ${totalRooms} rooms from ${startDate} to ${endDate} for ${numberOfGuests} guests.`,
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

const handlePayoutEvent = async (payout, status) => {
  try {
    const payoutId = payout.id;

    // Update the cashout status based on the event
    const updateCashoutQuery = `
      UPDATE cashouts
      SET status = ?, processed_at = NOW()
      WHERE payout_id = ? AND status = 'pending'
    `;
    await queryAsync(updateCashoutQuery, [status, payoutId]);
    console.log(`Cashout status updated to ${status}, payoutId:`, payoutId);

    // Update the transaction status (if relevant)
    const transactionStatus = status === 'completed' ? 'completed' : 'failed';
    const updateTransactionQuery = `
      UPDATE transactions
      SET status = ?
      WHERE payment_intent_id = ?
    `;
    await queryAsync(updateTransactionQuery, [transactionStatus, payoutId]);
    console.log(`Transaction status updated to ${transactionStatus}, payoutId:`, payoutId);

    if (status === 'failed') {
      console.error(`Payout failed for payoutId: ${payoutId}`);
      // Optional: Add any retry logic or notifications for failure
    }

  } catch (error) {
    console.error(`Error handling payout event (${status}):`, error);
    throw new Error(`Failed to update database for payout (${status})`);
  }
};

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
    const paymentIntent = event.data.object;

    switch (event.type) {
      case "payment_intent.created":
        // Lưu trạng thái pending khi Payment Intent được tạo
        await storePaymentEvent(event, paymentIntent);
        break;

      case "payment_intent.succeeded":
        const paymentMethodId = paymentIntent.payment_method;
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

        // store booking in database
        let bookingCode = await storeBooking(paymentIntent);

        // Store payment event
        await storePaymentEvent(event, paymentIntent);

        // Send confirmation email
        if (receiptEmail) {
          try {
            // Sử dụng email vừa lấy để gửi email xác nhận
            paymentIntent.receipt_email = receiptEmail;

            await sendConfirmationEmail(paymentIntent, bookingCode);
          } catch (err) {
            console.error("Error sending confirmation email:", err.message);
          }
        } else {
          console.log("No email provided for this payment.");
        }
        break;

      case "payment_intent.payment_failed":
        await storePaymentEvent(event, paymentIntent);
        // You could add failed payment notification logic here
        break;

      case "charge.refunded":
        // In case of refunds, payment_method might not exist
        if (paymentIntent.payment_method) {
          try {
            const paymentMethod = await stripe.paymentMethods.retrieve(
              paymentIntent.payment_method
            );
          } catch (err) {
            console.error(
              "Error retrieving payment method for refund:",
              err.message
            );
          }
        } else {
          console.log("No payment method available for refund.");
        }

        await storePaymentEvent(event, paymentIntent);
        break;

      // cases for payout
      case "payout.paid":
        const payoutPaid = event.data.object;
        await handlePayoutEvent(payoutPaid, "completed");
        break;

      case "payout.failed":
        const failedPayout = event.data.object;
        await handlePayoutEvent(failedPayout, "failed");
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
}
module.exports = { webhookController };
