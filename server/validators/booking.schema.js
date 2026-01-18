const Joi = require('joi');

/**
 * Booking validation schemas
 * Following RESTful API standards
 */

// Common validations
const bookingIdSchema = Joi.string().uuid().required().messages({
  'string.base': 'bookingId must be a string',
  'string.guid': 'bookingId must be a valid UUID',
  'any.required': 'bookingId is required',
});

const bookingCodeSchema = Joi.string().min(1).max(100).required().messages({
  'string.base': 'bookingCode must be a string',
  'string.min': 'bookingCode must not be empty',
  'string.max': 'bookingCode must not exceed 100 characters',
  'any.required': 'bookingCode is required',
});

/**
 * GET /api/bookings
 * Get all bookings for authenticated user
 */
exports.getUserBookings = {
  query: Joi.object({
    includeCancelled: Joi.boolean().default(false).messages({
      'boolean.base': 'includeCancelled must be a boolean',
    }),
  }),
};

/**
 * GET /api/bookings/:bookingId
 * Get a specific booking by ID
 */
exports.getBookingById = {
  params: Joi.object({
    bookingId: bookingIdSchema,
  }).required(),
  query: Joi.object({}).unknown(false), // No query params expected
};

/**
 * GET /api/bookings/code/:bookingCode
 * Get booking by booking code
 */
exports.getBookingByCode = {
  params: Joi.object({
    bookingCode: bookingCodeSchema,
  }).required(),
  query: Joi.object({}).unknown(false), // No query params expected
};

/**
 * DELETE /api/bookings/:bookingId
 * Cancel a booking
 */
exports.cancelBooking = {
  params: Joi.object({
    bookingId: bookingIdSchema,
  }).required(),
  query: Joi.object({
    processRefund: Joi.boolean().default(false).messages({
      'boolean.base': 'processRefund must be a boolean',
    }),
  }),
};
