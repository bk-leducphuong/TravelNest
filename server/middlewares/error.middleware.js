const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");

module.exports = (err, req, res, next) => {
  let apiError = err;

  // Convert unknown errors
  if (!(err instanceof ApiError)) {
    apiError = new ApiError(500, "INTERNAL_ERROR", "Internal server error");
  }

  logger.error(
    {
      err,
      requestId: req.id,
      path: req.originalUrl,
    },
    err.message,
  );

  res.status(apiError.statusCode).json({
    success: false,
    error: {
      code: apiError.code,
      message: apiError.message,
      details: apiError.details,
    },
  });
};
