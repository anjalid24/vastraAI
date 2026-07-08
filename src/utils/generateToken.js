const jwt = require('jsonwebtoken');

/**
 * Sign a JWT carrying the user's id and role. Role is embedded so the
 * authorization middleware can make decisions without an extra DB read,
 * while `protect` still re-loads the user to confirm they exist & are active.
 */
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = generateToken;
