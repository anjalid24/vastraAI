const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * protect — gate for authenticated routes.
 * 1. Reads a Bearer token from the Authorization header.
 * 2. Verifies its signature/expiry.
 * 3. Loads the user and confirms they still exist and are active.
 * 4. Attaches the user to req.user for downstream handlers.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Covers invalid signature and expired tokens alike.
    throw new ApiError(401, 'Not authorized, token invalid or expired');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'Not authorized, user no longer exists');
  }
  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  req.user = user;
  next();
});

/**
 * authorize(...roles) — role-based guard, used AFTER protect.
 * Usage: router.get('/admin', protect, authorize(ROLES.ADMIN), handler)
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized');
  }
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, `Role '${req.user.role}' is not permitted to access this resource`);
  }
  next();
};

module.exports = { protect, authorize };
