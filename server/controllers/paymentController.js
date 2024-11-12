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

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      bookingDetails,
      confirm: true,
      return_url: "http://localhost:5173/book/complete",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Store payment event information into database
const storePaymentEvent = async (event, paymentIntent) => {
  // query database...
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
      case "payment_intent.succeeded":
        console.log(paymentIntent)
        // Store payment event
        await storePaymentEvent(event, paymentIntent);

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
        await storePaymentEvent(event, paymentIntent);
        // You could add refund notification logic here
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
