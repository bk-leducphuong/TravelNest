class ApiError extends Error {
  constructor(statusCode, code, message, details = {}) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
