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
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
