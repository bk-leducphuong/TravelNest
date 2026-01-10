const ApiError = require('../utils/ApiError');
const logger = require('../config/logger.config');

module.exports = (err, req, res, next) => {
  let apiError = err;

  // Convert unknown errors
  if (!(err instanceof ApiError)) {
    apiError = new ApiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }

  logger.error(
    {
      err,
      requestId: req.id,
      path: req.originalUrl,
    },
    err.message
  );

  // Format error response per RESTful standards
  const errorResponse = {
    error: {
      code: apiError.code,
      message: apiError.message,
    },
  };

  // Add fields if it's a validation error (details contains field-level errors)
  if (apiError.details && Object.keys(apiError.details).length > 0) {
    errorResponse.error.fields = apiError.details;
  }

  res.status(apiError.statusCode).json(errorResponse);
};
