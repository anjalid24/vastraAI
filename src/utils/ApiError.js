/**
 * An Error subclass that carries an HTTP status code. Controllers/validators
 * throw these; the centralized error handler reads `statusCode` to respond
 * with the right code instead of defaulting to 500.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
