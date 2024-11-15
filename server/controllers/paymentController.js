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
    const seller_id = req.session.user.user_id;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: "http://localhost:5173/book/complete",
      metadata: {
        hotel_id: bookingDetails.hotel_id, // Add hotel_id into metadata
        seller_id: seller_id // Add seller_id into metadata
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Store payment event information into database
const storePaymentEvent = async (event, paymentIntent) => {
  
  try {
    const buyerQuery = "SELECT owner_id FROM hotels WHERE hotel_id = ?";
    const hotelId = paymentIntent.metadata.hotel_id; // Lấy từ metadata của Payment Intent
    const sellerId = paymentIntent.metadata.seller_id; 
    
    const buyerResult = await queryAsync(buyerQuery, [hotelId]);

    const buyerId = buyerResult[0]?.owner_id;
    const paymentMethod = paymentIntent.payment_method;
   // console.log("method: ",paymentMethod);
    const amount = paymentIntent.amount / 100; // Stripe sử dụng cent
    const currency = paymentIntent.currency.toUpperCase();
   
    const transactionType = "booking_payment"; // Loại giao dịch

    // Kiểm tra xem đã tồn tại transaction nào với payment_intent_id này chưa
    const checkTransactionQuery = `
        SELECT transaction_id FROM Transactions WHERE payment_intent_id = ?
    `;
    const transactionExists = await queryAsync(checkTransactionQuery, [paymentIntent.id]);

    if (transactionExists.length === 0) {
        // Nếu chưa có, chèn một giao dịch mới với trạng thái "pending"
        const transactionQuery = `
            INSERT INTO Transactions (buyer_id, seller_id, amount, currency, status, transaction_type, payment_intent_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const transactionResult = await queryAsync(transactionQuery, [
            buyerId,sellerId, amount, currency, "pending", transactionType, paymentIntent.id,
        ]);

        const transactionId = transactionResult.insertId;

        // Lưu thông tin thanh toán vào bảng Payments với trạng thái "pending"
        const paymentQuery = `
            INSERT INTO Payments (transaction_id, payment_method, payment_status, amount, currency, paid_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await queryAsync(paymentQuery, [
            transactionId, "pending", "pending", amount, currency, new Date(),
        ]);
        console.log(`Payment event stored successfully in database.`);
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
        await queryAsync(updatePaymentQuery, ["success",paymentMethod, transactionId]);
        console.log(`Payment event updated successfully in database.`);
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

// Utility function to send confirmation email
const sendConfirmationEmail = async (paymentIntent) => {
  try {
    const { subject, html } = createOrderConfirmationEmail(paymentIntent);

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: paymentIntent.receipt_email,
      subject,
      html,
    });

    console.log("Confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

// Recieve webhook events
const webhookController = async (req, res) => {
  let event = req.body;
  //console.log("body: ", req.body);

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    const sig = req.headers["stripe-signature"];
  //  console.log("sig :", sig);
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
      if (paymentMethodId) {
        try {
          const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      
        } catch (err) {
          console.error("Error retrieving payment method:", err.message);
        }
      } else {
        console.log("No payment method provided in this event.");
      }

        // Store payment event
        await storePaymentEvent(event, paymentIntent);
        console.log("ok sucess");

        // Send confirmation email
        // if (paymentIntent.receipt_email) {
        //   await sendConfirmationEmail(paymentIntent);
        // }
        break;
      
      

      case "payment_intent.payment_failed":
        await storePaymentEvent(event, paymentIntent);
        // You could add failed payment notification logic here
        break;

      case "charge.refunded":
        console.log("Charge refunded:", paymentIntent);

        // In case of refunds, payment_method might not exist
        if (paymentIntent.payment_method) {
          try {
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
            //console.log("Payment Method Retrieved:", paymentMethod);
          } catch (err) {
            console.error("Error retrieving payment method for refund:", err.message);
          }
        } else {
          console.log("No payment method available for refund.");
        }

        await storePaymentEvent(event, paymentIntent);
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

module.exports = { handlePayment, webhookController };
