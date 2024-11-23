require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connection = require("../config/db");
const { promisify } = require("util");
const transporter = require("../config/nodemailer");
const { init, getIO } = require("../config/socket");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

async function getSellerId(paymentIntent) {
  try {
    const sellerQuery = "SELECT owner_id FROM hotels WHERE hotel_id = ?";
    const hotelId = paymentIntent.metadata.hotel_id; // Lấy từ metadata của Payment Intent
    const buyerId = paymentIntent.metadata.buyer_id;

    const sellerResult = await queryAsync(sellerQuery, [hotelId]);
    const sellerId = sellerResult[0]?.owner_id;
    return sellerId;
  } catch (error) {
    console.error(error);
  }
}

// Store payment event information into database
const storePaymentEvent = async (event, paymentIntent) => {
  try {
    const buyerId = paymentIntent.metadata.buyer_id;

    const sellerId = await getSellerId(paymentIntent);

    const paymentMethod = paymentIntent.payment_method;

    const amount = paymentIntent.amount / 100; // Stripe sử dụng cent
    const currency = paymentIntent.currency.toUpperCase();

    const transactionType = "booking_payment"; // Loại giao dịch

    // Kiểm tra xem đã tồn tại transaction nào với payment_intent_id này chưa
    const checkTransactionQuery = `
        SELECT transaction_id FROM Transactions WHERE payment_intent_id = ?
    `;
    const transactionExists = await queryAsync(checkTransactionQuery, [
      paymentIntent.id,
    ]);

    if (transactionExists.length === 0) {
      // Nếu chưa có, chèn một giao dịch mới với trạng thái "pending"
      const transactionQuery = `
            INSERT INTO Transactions (buyer_id, seller_id, amount, currency, status, transaction_type, payment_intent_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
      const transactionResult = await queryAsync(transactionQuery, [
        buyerId,
        sellerId,
        amount,
        currency,
        "pending",
        transactionType,
        paymentIntent.id,
      ]);

      const transactionId = transactionResult.insertId;

      // Lưu thông tin thanh toán vào bảng Payments với trạng thái "pending"
      const paymentQuery = `
            INSERT INTO Payments (transaction_id, payment_method, payment_status, amount, currency, paid_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
      await queryAsync(paymentQuery, [
        transactionId,
        "pending",
        "pending",
        amount,
        currency,
        new Date(),
      ]);
    } else {
      // Nếu đã tồn tại transaction, chỉ cập nhật trạng thái
      const transactionId = transactionExists[0].transaction_id;

      // Cập nhật trạng thái transaction thành "success"
      const updateTransactionQuery = `
            UPDATE Transactions SET status = ? WHERE transaction_id = ?
        `;
      await queryAsync(updateTransactionQuery, ["completed", transactionId]);

      // Cập nhật trạng thái payment thành "success"
      const updatePaymentQuery = `
            UPDATE Payments SET payment_status = ?, payment_method=? WHERE transaction_id = ?
        `;
      await queryAsync(updatePaymentQuery, [
        "success",
        paymentMethod,
        transactionId,
      ]);
    }
  } catch (error) {
    console.error("Error storing payment event:", error);
  }
};

// Utility function to store payment event in database
// Email template function
const createOrderConfirmationEmail = (paymentIntent) => {
  const amount = (paymentIntent.amount / 100).toFixed(2);
  return {
    subject: "Order Confirmation - Thank You for Your Purchase!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your order!</h2>
        <p>Your payment of ${paymentIntent.currency.toUpperCase()} ${amount} has been processed successfully.</p>
        <p>Order Details:</p>
        <ul>
          <li>Order ID: ${paymentIntent.id}</li>
          <li>Amount: ${paymentIntent.currency.toUpperCase()} ${amount}</li>
          <li>Date: ${new Date().toLocaleDateString()}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      </div>
    `,
  };
};

// Utility function to send confirmation emails
const sendConfirmationEmail = async (paymentIntent) => {
  try {
    const { subject, html } = createOrderConfirmationEmail(paymentIntent);

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: paymentIntent.receipt_email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

// payment event handler for socket io
async function sendPaymentNotification(paymentIntent) {
  const io = getIO();

  const notification = {
    hotel_owner_id: await getSellerId(paymentIntent),
    type: "payment",
    message: "Bạn có một đơn đặt phòng mới.",
  };

  io.to(`owner_${notification.hotel_owner_id}`).emit("newNotification", {
    type: notification.type,
    message: notification.message,
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
        await sendPaymentNotification(paymentIntent);

        // Store payment event
        await storePaymentEvent(event, paymentIntent);

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
