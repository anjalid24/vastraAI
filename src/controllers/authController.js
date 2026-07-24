const User = require('../models/User');
const Subscription = require('../models/Subscription');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendResetEmail, sendWelcomeEmail, sendVerificationEmail } = require('../services/authService');
const logger = require('../middleware/logger');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'free'
    });

    // Create free subscription
    const subscription = await Subscription.create({
      user: user._id,
      plan: 'free',
      status: 'active',
      features: {
        unlimitedGeneration: false,
        pricingCalculator: false,
        shippingEstimator: false,
        designHistory: false,
        contactArtisans: false,
        downloadHD: false,
        commercialLicense: false
      }
    });

    // Update user with subscription
    user.subscription = subscription._id;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(user).catch(err => logger.error('Welcome email error:', err));

    // Send verification email (async, don't wait)
    sendVerificationEmail(user).catch(err => logger.error('Verification email error:', err));

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          generationCount: user.generationCount,
          subscription: {
            plan: subscription.plan,
            features: subscription.features
          }
        }
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      return res.status(401).json({
        status: 'error',
        message: `Account locked. Please try again in ${lockTime} minutes.`
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      
      const remainingAttempts = 5 - user.loginAttempts;
      return res.status(401).json({
        status: 'error',
        message: `Invalid credentials. ${remainingAttempts} attempts remaining.`
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Get subscription
    const subscription = await Subscription.findOne({ user: user._id });

    // Generate token
    const token = generateToken(user._id);

    // Log login
    logger.info('User logged in', { userId: user._id, email: user.email });

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          generationCount: user.generationCount,
          subscription: subscription ? {
            plan: subscription.plan,
            features: subscription.features
          } : null
        }
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('subscription')
      .populate('artisanProfile')
      .select('-password');

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with this email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send reset email (async, don't wait)
    sendResetEmail(email, resetToken).catch(err => logger.error('Reset email error:', err));

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent. Please check your inbox.'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate new token
    const newToken = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      token: newToken,
      message: 'Password reset successful'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification token'
      });
    }
    
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};