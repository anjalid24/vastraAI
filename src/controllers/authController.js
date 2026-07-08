const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
const { validateSignup, validateLogin } = require('../utils/validators');

/**
 * @desc    Register a new user (role: brand or artisan)
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
  const data = validateSignup(req.body); // throws ApiError(400) on bad input

  const exists = await User.findOne({ email: data.email });
  if (exists) {
    throw new ApiError(409, 'Email is already registered');
  }

  // Password hashing happens in the User model's pre-save hook.
  const user = await User.create(data);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: user.toSafeJSON(),
      token: generateToken(user._id, user.role),
    },
  });
});

/**
 * @desc    Authenticate a user and return a JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = validateLogin(req.body);

  // Explicitly select the password since the schema hides it by default.
  const user = await User.findOne({ email }).select('+password');

  // Same generic message whether the email or password is wrong,
  // to avoid leaking which accounts exist.
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: user.toSafeJSON(),
      token: generateToken(user._id, user.role),
    },
  });
});

/**
 * @desc    Get the currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private (any authenticated role)
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the `protect` middleware.
  res.status(200).json({ success: true, data: { user: req.user.toSafeJSON() } });
});

/**
 * @desc    Example admin-only protected route
 * @route   GET /api/auth/admin
 * @access  Private (admin)
 */
const adminOnly = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome admin ${req.user.name}. You have elevated access.`,
  });
});

module.exports = { signup, login, getMe, adminOnly };
