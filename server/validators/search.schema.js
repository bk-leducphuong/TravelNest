const Joi = require('joi');

/**
 * Search validation schemas
 * Following RESTful API standards
 */

// Common validations
const locationSchema = Joi.string().min(1).max(255).trim().required().messages({
  'string.base': 'location must be a string',
  'string.min': 'location must not be empty',
  'string.max': 'location must not exceed 255 characters',
  'any.required': 'location is required',
});

const dateSchema = Joi.string()
  .isoDate()
  .required()
  .messages({
    'string.isoDate': 'Date must be in ISO 8601 format (YYYY-MM-DD)',
    'any.required': 'Date is required',
  });

const positiveIntegerSchema = Joi.number().integer().positive().required().messages({
  'number.base': 'Must be a number',
  'number.integer': 'Must be an integer',
  'number.positive': 'Must be a positive number',
  'any.required': 'This field is required',
});

const nonNegativeIntegerSchema = Joi.number().integer().min(0).required().messages({
  'number.base': 'Must be a number',
  'number.integer': 'Must be an integer',
  'number.min': 'Must be 0 or greater',
  'any.required': 'This field is required',
});

/**
 * GET /api/search
 * Search hotels by location and availability
 */
exports.searchHotels = {
  query: Joi.object({
    location: locationSchema,
    adults: positiveIntegerSchema,
    children: nonNegativeIntegerSchema,
    checkInDate: dateSchema,
    checkOutDate: dateSchema,
    rooms: positiveIntegerSchema,
    numberOfDays: Joi.number().integer().positive().optional().messages({
      'number.base': 'numberOfDays must be a number',
      'number.integer': 'numberOfDays must be an integer',
      'number.positive': 'numberOfDays must be positive',
    }),
  })
    .required()
    .custom((value, helpers) => {
      // Validate that checkOutDate is after checkInDate
      const checkIn = new Date(value.checkInDate);
      const checkOut = new Date(value.checkOutDate);
      if (checkOut <= checkIn) {
        return helpers.error('any.custom', {
          message: 'checkOutDate must be after checkInDate',
        });
      }

      // Validate that numberOfDays matches the date range if provided
      if (value.numberOfDays) {
        const daysDiff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if (parseInt(value.numberOfDays, 10) !== daysDiff) {
          return helpers.error('any.custom', {
            message:
              'numberOfDays must match the difference between checkInDate and checkOutDate',
          });
        }
      }

      return value;
    }),
};

/**
 * POST /api/search
 * Save search information to search logs
 */
exports.saveSearchInformation = {
  body: Joi.object({
    searchData: Joi.object({
      location: locationSchema,
      checkInDate: dateSchema,
      checkOutDate: dateSchema,
      adults: positiveIntegerSchema,
      children: nonNegativeIntegerSchema,
      rooms: positiveIntegerSchema,
      numberOfDays: positiveIntegerSchema,
    })
      .required()
      .custom((value, helpers) => {
        // Validate that checkOutDate is after checkInDate
        const checkIn = new Date(value.checkInDate);
        const checkOut = new Date(value.checkOutDate);
        if (checkOut <= checkIn) {
          return helpers.error('any.custom', {
            message: 'checkOutDate must be after checkInDate',
          });
        }

        // Validate that numberOfDays matches the date range
        const daysDiff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if (parseInt(value.numberOfDays, 10) !== daysDiff) {
          return helpers.error('any.custom', {
            message:
              'numberOfDays must match the difference between checkInDate and checkOutDate',
          });
        }

        return value;
      }),
  })
    .unknown(false)
    .custom((value, helpers) => {
      // Also support flat structure (for backward compatibility)
      if (!value.searchData) {
        // Check if all required fields are at root level
        const requiredFields = [
          'location',
          'checkInDate',
          'checkOutDate',
          'adults',
          'children',
          'rooms',
          'numberOfDays',
        ];
        const hasAllFields = requiredFields.every((field) => value[field] !== undefined);

        if (hasAllFields) {
          // Transform flat structure to nested structure
          value.searchData = {
            location: value.location,
            checkInDate: value.checkInDate,
            checkOutDate: value.checkOutDate,
            adults: value.adults,
            children: value.children,
            rooms: value.rooms,
            numberOfDays: value.numberOfDays,
          };
        }
      }
      return value;
    }),
};
