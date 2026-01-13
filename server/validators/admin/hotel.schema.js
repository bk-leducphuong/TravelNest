const Joi = require('joi');

/**
 * Admin Hotel validation schemas
 * Following RESTful API standards
 */

/**
 * GET /api/admin/hotels
 * Get all hotels owned by the authenticated admin
 */
exports.getAllHotels = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'page must be a number',
      'number.integer': 'page must be an integer',
      'number.min': 'page must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).default(20).messages({
      'number.base': 'limit must be a number',
      'number.integer': 'limit must be an integer',
      'number.min': 'limit must be at least 1',
      'number.max': 'limit must not exceed 100',
    }),
  }),
};

/**
 * GET /api/admin/hotels/:hotelId
 * Get a specific hotel by ID
 */
exports.getHotelById = {
  params: Joi.object({
    hotelId: Joi.number().integer().positive().required().messages({
      'number.base': 'hotelId must be a number',
      'number.integer': 'hotelId must be an integer',
      'number.positive': 'hotelId must be a positive number',
      'any.required': 'hotelId is required',
    }),
  }).required(),
  query: Joi.object({}).unknown(false),
};

/**
 * PATCH /api/admin/hotels/:hotelId
 * Update hotel information
 */
exports.updateHotel = {
  params: Joi.object({
    hotelId: Joi.number().integer().positive().required().messages({
      'number.base': 'hotelId must be a number',
      'number.integer': 'hotelId must be an integer',
      'number.positive': 'hotelId must be a positive number',
      'any.required': 'hotelId is required',
    }),
  }).required(),
  body: Joi.object({
    name: Joi.string().min(1).max(255).messages({
      'string.base': 'name must be a string',
      'string.min': 'name must not be empty',
      'string.max': 'name must not exceed 255 characters',
    }),
    description: Joi.string().allow('').max(5000).messages({
      'string.base': 'description must be a string',
      'string.max': 'description must not exceed 5000 characters',
    }),
    address: Joi.string().max(500).messages({
      'string.base': 'address must be a string',
      'string.max': 'address must not exceed 500 characters',
    }),
    city: Joi.string().max(100).messages({
      'string.base': 'city must be a string',
      'string.max': 'city must not exceed 100 characters',
    }),
    country: Joi.string().max(100).messages({
      'string.base': 'country must be a string',
      'string.max': 'country must not exceed 100 characters',
    }),
    phone_number: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .max(20)
      .messages({
        'string.base': 'phone_number must be a string',
        'string.pattern.base': 'phone_number must be a valid phone number',
        'string.max': 'phone_number must not exceed 20 characters',
      }),
    email: Joi.string().email().max(255).messages({
      'string.base': 'email must be a string',
      'string.email': 'email must be a valid email address',
      'string.max': 'email must not exceed 255 characters',
    }),
    star_rating: Joi.number().min(0).max(5).messages({
      'number.base': 'star_rating must be a number',
      'number.min': 'star_rating must be at least 0',
      'number.max': 'star_rating must not exceed 5',
    }),
    hotel_amenities: Joi.string().max(2000).messages({
      'string.base': 'hotel_amenities must be a string',
      'string.max': 'hotel_amenities must not exceed 2000 characters',
    }),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),
};
