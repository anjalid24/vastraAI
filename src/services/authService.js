const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const logger = require('../middleware/logger');

// Generate JWT token
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate password reset token
exports.generateResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  return resetToken;
};

// Send password reset email
exports.sendResetEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Vastra AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - Vastra AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4A90D9; color: white; padding: 20px; text-align: center; }
            .button { display: inline-block; padding: 12px 24px; background: #4A90D9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vastra AI</h1>
            </div>
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password for your Vastra AI account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p><strong>Note:</strong> This link will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <div class="footer">
              <p>Vastra AI - Preserving India's Textile Heritage</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    logger.info('Reset email sent', { email });
    return true;
  } catch (error) {
    logger.error('Email sending error:', error);
    return false;
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Vastra AI" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Welcome to Vastra AI!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4A90D9; color: white; padding: 20px; text-align: center; }
            .button { display: inline-block; padding: 12px 24px; background: #4A90D9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Vastra AI</h1>
            </div>
            <h2>Hello ${user.name}!</h2>
            <p>We're excited to have you join our textile ecosystem.</p>
            <p>Start exploring Indian textile heritage and create stunning AI-powered designs.</p>
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/dashboard" class="button">Get Started</a>
            </div>
            <div class="footer">
              <p>Vastra AI - Preserving India's Textile Heritage</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    return true;
  } catch (error) {
    logger.error('Welcome email error:', error);
    return false;
  }
};

// Send verification email
exports.sendVerificationEmail = async (user) => {
  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await transporter.sendMail({
      from: `"Vastra AI" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Verify Your Email - Vastra AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4A90D9; color: white; padding: 20px; text-align: center; }
            .button { display: inline-block; padding: 12px 24px; background: #4A90D9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email</h1>
            </div>
            <h2>Hello ${user.name}!</h2>
            <p>Please verify your email address to get full access to Vastra AI.</p>
            <div style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify Email</a>
            </div>
            <p><strong>Note:</strong> This link will expire in 24 hours.</p>
            <div class="footer">
              <p>Vastra AI - Preserving India's Textile Heritage</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    return true;
  } catch (error) {
    logger.error('Verification email error:', error);
    return false;
  }
};

// Check user permissions
exports.checkPermission = (user, requiredRole) => {
  const roleHierarchy = {
    free: 0,
    brand: 1,
    artisan: 2,
    admin: 3
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

// Validate password strength
exports.validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push('Password must be at least 8 characters');
  if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
  if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
  if (!hasNumber) errors.push('Password must contain at least one number');
  if (!hasSpecial) errors.push('Password must contain at least one special character');

  return {
    valid: errors.length === 0,
    errors
  };
};