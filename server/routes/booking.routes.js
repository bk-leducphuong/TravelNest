const express = require('express');
const {
  getUserBookings,
  getBookingById,
  getBookingByCode,
  cancelBooking,
} = require('../controllers/booking.controller.js');
const { isUserAuthenticated } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const bookingSchema = require('../validators/booking.schema');
const router = express.Router();

// root route: /api/bookings
// All routes require authentication
router.use(isUserAuthenticated);

/**
 * GET /api/bookings
 * Get all bookings for authenticated user
 */
router.get(
  '/',
  validate(bookingSchema.getUserBookings),
  getUserBookings
);

/**
 * GET /api/bookings/code/:bookingCode
 * Get booking by booking code
 */
router.get(
  '/code/:bookingCode',
  validate(bookingSchema.getBookingByCode),
  getBookingByCode
);

/**
 * GET /api/bookings/:bookingId
 * Get a specific booking by ID
 */
router.get(
  '/:bookingId',
  validate(bookingSchema.getBookingById),
  getBookingById
);

/**
 * DELETE /api/bookings/:bookingId
 * Cancel a booking
 */
router.delete(
  '/:bookingId',
  validate(bookingSchema.cancelBooking),
  cancelBooking
);

module.exports = router;
