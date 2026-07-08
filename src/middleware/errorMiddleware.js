/**
 * 404 handler — reached when no route matched the request.
 * Sets the status and forwards a descriptive error to the error handler.
 */
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found - ${req.originalUrl}`));
};

/**
 * Centralized error handler. Every error passed to next(err) — or thrown
 * in an async handler and forwarded — funnels through here so responses
 * stay consistent. Stack traces are hidden in production.
 *
 * Note: Express identifies this as an error handler by its four arguments,
 * so `next` must stay in the signature even though it is unused.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Prefer an explicit status from ApiError, then any status already set on
  // the response (e.g. by notFound), otherwise fall back to 500.
  let statusCode =
    err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Server Error';

  // Normalize common Mongoose errors to appropriate 4xx codes.
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value for field: ${field}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
