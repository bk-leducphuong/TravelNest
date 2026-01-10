const paymentRepository = require('../repositories/payment.repository');
const ApiError = require('../utils/ApiError');

/**
 * Payment Service - Contains main business logic
 * Follows RESTful API standards
 * Includes Stripe payment integration
 */

class PaymentService {
  /**
   * Create a payment intent for booking
   * @param {number} userId - User ID
   * @param {Object} paymentData - Payment data
   * @param {string} paymentData.paymentMethodId - Stripe payment method ID
   * @param {number} paymentData.amount - Amount in cents
   * @param {string} paymentData.currency - Currency code (e.g., 'usd')
   * @param {Object} paymentData.bookingDetails - Booking details
   * @returns {Promise<Object>} Payment intent with client secret
   */
  async createPaymentIntent(userId, paymentData) {
    const {
      paymentMethodId,
      amount,
      currency,
      bookingDetails,
    } = paymentData;

    // Validate required fields
    if (!paymentMethodId || !amount || !currency || !bookingDetails) {
      throw new ApiError(
        400,
        'MISSING_REQUIRED_FIELDS',
        'paymentMethodId, amount, currency, and bookingDetails are required'
      );
    }

    // Validate booking details
    if (
      !bookingDetails.bookingCode ||
      !bookingDetails.hotelId ||
      !bookingDetails.checkInDate ||
      !bookingDetails.checkOutDate ||
      !bookingDetails.numberOfGuests
    ) {
      throw new ApiError(
        400,
        'INVALID_BOOKING_DETAILS',
        'bookingDetails must include bookingCode, hotelId, checkInDate, checkOutDate, and numberOfGuests'
      );
    }

    // Validate amount
    if (amount <= 0) {
      throw new ApiError(
        400,
        'INVALID_AMOUNT',
        'Amount must be greater than 0'
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new ApiError(
        500,
        'STRIPE_NOT_CONFIGURED',
        'Stripe is not configured. Cannot process payment.'
      );
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure amount is in cents
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirm: true,
      return_url: process.env.CLIENT_HOST
        ? `${process.env.CLIENT_HOST}/book/complete`
        : 'http://localhost:5173/book/complete',
      metadata: {
        booking_code: bookingDetails.bookingCode,
        hotel_id: bookingDetails.hotelId.toString(),
        buyer_id: userId.toString(),
        booked_rooms: JSON.stringify(bookingDetails.bookedRooms || []),
        check_in_date: bookingDetails.checkInDate,
        check_out_date: bookingDetails.checkOutDate,
        number_of_guests: bookingDetails.numberOfGuests.toString(),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    };
  }

  /**
   * Get payment information by booking ID
   * @param {number} bookingId - Booking ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<Object>} Payment information
   */
  async getPaymentByBookingId(bookingId, userId) {
    const payment = await paymentRepository.findPaymentByBookingId(bookingId);

    if (!payment) {
      throw new ApiError(404, 'PAYMENT_NOT_FOUND', 'Payment not found');
    }

    // Verify transaction belongs to user
    if (payment.buyer_id !== userId) {
      throw new ApiError(
        403,
        'FORBIDDEN',
        'You do not have permission to view this payment'
      );
    }

    const paymentData = payment.toJSON ? payment.toJSON() : payment;

    return {
      transaction_id: paymentData.transaction_id,
      amount: parseFloat(paymentData.amount),
      currency: paymentData.currency,
      status: paymentData.status,
      transaction_type: paymentData.transaction_type,
      created_at: paymentData.created_at,
      payment: paymentData.payments && paymentData.payments.length > 0
        ? paymentData.payments[0]
        : null,
      hotel: paymentData.hotels || paymentData.Hotel,
    };
  }

  /**
   * Get payment information by transaction ID
   * @param {number} transactionId - Transaction ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<Object>} Payment information
   */
  async getPaymentByTransactionId(transactionId, userId) {
    const transaction = await paymentRepository.findTransactionById(
      transactionId
    );

    if (!transaction) {
      throw new ApiError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found');
    }

    // Verify transaction belongs to user
    if (transaction.buyer_id !== userId) {
      throw new ApiError(
        403,
        'FORBIDDEN',
        'You do not have permission to view this transaction'
      );
    }

    const payment = await paymentRepository.findPaymentByTransactionId(
      transactionId
    );

    const transactionData = transaction.toJSON
      ? transaction.toJSON()
      : transaction;

    return {
      transaction_id: transactionData.transaction_id,
      amount: parseFloat(transactionData.amount),
      currency: transactionData.currency,
      status: transactionData.status,
      transaction_type: transactionData.transaction_type,
      created_at: transactionData.created_at,
      payment: payment
        ? (payment.toJSON ? payment.toJSON() : payment)
        : null,
    };
  }

  /**
   * Get all payments for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 20, max: 100)
   * @returns {Promise<Object>} Payments with pagination metadata
   */
  async getUserPayments(userId, options = {}) {
    const { page = 1, limit = 20 } = options;

    // Validate limit
    const validatedLimit = Math.min(limit, 100);
    const offset = (page - 1) * validatedLimit;

    const result = await paymentRepository.findPaymentsByBuyerId(userId, {
      limit: validatedLimit,
      offset,
    });

    return {
      payments: result.rows.map((transaction) => {
        const transactionData = transaction.toJSON
          ? transaction.toJSON()
          : transaction;
        return {
          transaction_id: transactionData.transaction_id,
          amount: parseFloat(transactionData.amount),
          currency: transactionData.currency,
          status: transactionData.status,
          transaction_type: transactionData.transaction_type,
          created_at: transactionData.created_at,
          payment: transactionData.payments && transactionData.payments.length > 0
            ? transactionData.payments[0]
            : null,
          hotel: transactionData.hotels || transactionData.Hotel,
        };
      }),
      page,
      limit: validatedLimit,
      total: result.count,
    };
  }
}

module.exports = new PaymentService();
