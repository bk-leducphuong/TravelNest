const Joi = require('joi');

/**
 * Admin Notification validation schemas
 * Following RESTful API standards
 */

// Common validations
const hotelIdSchema = Joi.number().integer().positive().required().messages({
  'number.base': 'hotelId must be a number',
  'number.integer': 'hotelId must be an integer',
  'number.positive': 'hotelId must be a positive number',
  'any.required': 'hotelId is required',
});

const notificationIdSchema = Joi.number()
  .integer()
  .positive()
  .required()
  .messages({
    'number.base': 'notificationId must be a number',
    'number.integer': 'notificationId must be an integer',
    'number.positive': 'notificationId must be a positive number',
    'any.required': 'notificationId is required',
  });

/**
 * GET /api/admin/notifications
 * Get all notifications for a specific hotel
 */
exports.getNotifications = {
  query: Joi.object({
    hotelId: hotelIdSchema,
    isRead: Joi.boolean().messages({
      'boolean.base': 'isRead must be a boolean',
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
 * GET /api/admin/notifications/:notificationId
 * Get a specific notification by ID
 */
exports.getNotificationById = {
  params: Joi.object({
    notificationId: notificationIdSchema,
  }).required(),
  query: Joi.object({}).unknown(false),
};

/**
 * PATCH /api/admin/notifications/:notificationId/read
 * Mark a specific notification as read
 */
exports.markNotificationAsRead = {
  params: Joi.object({
    notificationId: notificationIdSchema,
  }).required(),
};

/**
 * PATCH /api/admin/notifications/read-all
 * Mark all notifications as read for a hotel
 */
exports.markAllNotificationsAsRead = {
  body: Joi.object({
    hotelId: hotelIdSchema,
  }).required(),
};

/**
 * DELETE /api/admin/notifications/:notificationId
 * Delete a notification
 */
exports.deleteNotification = {
  params: Joi.object({
    notificationId: notificationIdSchema,
  }).required(),
};
