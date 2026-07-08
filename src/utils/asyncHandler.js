/**
 * Wrap an async route handler so any rejected promise is forwarded to
 * Express's centralized error handler via next(err). Removes the need for
 * a try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
