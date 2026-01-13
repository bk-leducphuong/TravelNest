const Joi = require('joi');

/**
 * Admin Review validation schemas
 * Following RESTful API standards
 */

// Common validations
const hotelIdSchema = Joi.number().integer().positive().required().messages({
  'number.base': 'hotelId must be a number',
  'number.integer': 'hotelId must be an integer',
  'number.positive': 'hotelId must be a positive number',
  'any.required': 'hotelId is required',
});

const reviewIdSchema = Joi.number().integer().positive().required().messages({
  'number.base': 'reviewId must be a number',
  'number.integer': 'reviewId must be an integer',
  'number.positive': 'reviewId must be a positive number',
  'any.required': 'reviewId is required',
});

/**
 * GET /api/admin/reviews
 * Get all reviews for a specific hotel
 */
exports.getAllReviews = {
  query: Joi.object({
    hotelId: hotelIdSchema,
    hasReply: Joi.boolean().messages({
      'boolean.base': 'hasReply must be a boolean',
    }),
    minRating: Joi.number().min(0).max(5).messages({
      'number.base': 'minRating must be a number',
      'number.min': 'minRating must be at least 0',
      'number.max': 'minRating must not exceed 5',
    }),
    maxRating: Joi.number().min(0).max(5).messages({
      'number.base': 'maxRating must be a number',
      'number.min': 'maxRating must be at least 0',
      'number.max': 'maxRating must not exceed 5',
    }),
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
 * GET /api/admin/reviews/:reviewId
 * Get a specific review by ID
 */
exports.getReviewById = {
  params: Joi.object({
    reviewId: reviewIdSchema,
  }).required(),
  query: Joi.object({}).unknown(false),
};

/**
 * POST /api/admin/reviews/:reviewId/reply
 * Reply to a review
 */
exports.replyToReview = {
  params: Joi.object({
    reviewId: reviewIdSchema,
  }).required(),
  body: Joi.object({
    reply: Joi.string().min(1).max(2000).required().messages({
      'string.base': 'reply must be a string',
      'string.min': 'reply must not be empty',
      'string.max': 'reply must not exceed 2000 characters',
      'any.required': 'reply is required',
    }),
  }).required(),
};

/**
 * PATCH /api/admin/reviews/:reviewId/reply
 * Update a reply to a review
 */
exports.updateReply = {
  params: Joi.object({
    reviewId: reviewIdSchema,
  }).required(),
  body: Joi.object({
    reply: Joi.string().min(1).max(2000).required().messages({
      'string.base': 'reply must be a string',
      'string.min': 'reply must not be empty',
      'string.max': 'reply must not exceed 2000 characters',
      'any.required': 'reply is required',
    }),
  }).required(),
};

/**
 * DELETE /api/admin/reviews/:reviewId/reply
 * Delete a reply to a review
 */
exports.deleteReply = {
  params: Joi.object({
    reviewId: reviewIdSchema,
  }).required(),
};
