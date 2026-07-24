// Validate email
const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian)
const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate password strength
const validatePassword = (password) => {
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

// Validate URL
const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate hex color
const validateHexColor = (color) => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

// Validate object ID (MongoDB)
const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// Sanitize input (prevent XSS)
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  return input;
};

// Sanitize object
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

// Validate Indian PIN code
const validatePIN = (pin) => {
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(pin);
};

// Validate GST number
const validateGST = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

// Validate Aadhaar number
const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
  return aadhaarRegex.test(aadhaar);
};

// Validate PAN number
const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

// Validate IFSC code
const validateIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};

// Validate percentage (0-100)
const validatePercentage = (value) => {
  return typeof value === 'number' && value >= 0 && value <= 100;
};

// Validate rating (0-5)
const validateRating = (rating) => {
  return typeof rating === 'number' && rating >= 0 && rating <= 5;
};

// Express validator middleware
const validate = (validationRules) => {
  return async (req, res, next) => {
    const errors = [];

    for (const rule of validationRules) {
      const { field, rules, required } = rule;
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], req.body)
        : req.body[field];

      if (required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        for (const validator of rules) {
          const result = validator(value);
          if (result !== true) {
            errors.push(result);
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// Common validators
const validators = {
  isEmail: (value) => validateEmail(value) || `${value} is not a valid email address`,
  isPhone: (value) => validatePhone(value) || `${value} is not a valid phone number`,
  isPassword: (value) => {
    const result = validatePassword(value);
    return result.valid || result.errors[0];
  },
  isURL: (value) => validateURL(value) || `${value} is not a valid URL`,
  isHexColor: (value) => validateHexColor(value) || `${value} is not a valid hex color`,
  isObjectId: (value) => validateObjectId(value) || `${value} is not a valid ID`,
  isPIN: (value) => validatePIN(value) || `${value} is not a valid PIN code`,
  isGST: (value) => validateGST(value) || `${value} is not a valid GST number`,
  isAadhaar: (value) => validateAadhaar(value) || `${value} is not a valid Aadhaar number`,
  isPAN: (value) => validatePAN(value) || `${value} is not a valid PAN number`,
  isIFSC: (value) => validateIFSC(value) || `${value} is not a valid IFSC code`,
  isPercentage: (value) => validatePercentage(value) || `${value} must be between 0 and 100`,
  isRating: (value) => validateRating(value) || `${value} must be between 0 and 5`,
  minLength: (min) => (value) => value.length >= min || `Must be at least ${min} characters`,
  maxLength: (max) => (value) => value.length <= max || `Must be at most ${max} characters`,
  min: (min) => (value) => value >= min || `Must be at least ${min}`,
  max: (max) => (value) => value <= max || `Must be at most ${max}`,
  isEnum: (enumValues) => (value) => enumValues.includes(value) || `Must be one of: ${enumValues.join(', ')}`
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateURL,
  validateHexColor,
  validateObjectId,
  sanitizeInput,
  sanitizeObject,
  validatePIN,
  validateGST,
  validateAadhaar,
  validatePAN,
  validateIFSC,
  validatePercentage,
  validateRating,
  validate,
  validators
};