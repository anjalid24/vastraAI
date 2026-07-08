const ApiError = require('./ApiError');
const { SIGNUP_ROLES } = require('../config/roles');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

/**
 * Validate & normalize the signup payload. Throws ApiError(400) on the
 * first problem so the centralized error handler returns a 400 response.
 * Returns a clean object safe to pass to User.create.
 */
const validateSignup = ({ name, email, password, role } = {}) => {
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new ApiError(400, 'Name is required and must be at least 2 characters');
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    throw new ApiError(400, 'A valid email is required');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new ApiError(400, 'Password is required and must be at least 6 characters');
  }

  // Role is optional; if provided it must be a self-assignable role.
  // Admin cannot be granted through public signup.
  let normalizedRole;
  if (role !== undefined) {
    if (!SIGNUP_ROLES.includes(role)) {
      throw new ApiError(400, `Role must be one of: ${SIGNUP_ROLES.join(', ')}`);
    }
    normalizedRole = role;
  }

  return {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    ...(normalizedRole ? { role: normalizedRole } : {}),
  };
};

/**
 * Validate the login payload. Throws ApiError(400) when incomplete.
 */
const validateLogin = ({ email, password } = {}) => {
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    throw new ApiError(400, 'A valid email is required');
  }
  if (!password || typeof password !== 'string') {
    throw new ApiError(400, 'Password is required');
  }
  return { email: email.toLowerCase().trim(), password };
};

module.exports = { validateSignup, validateLogin };
