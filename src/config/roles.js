/**
 * Application roles — a single source of truth shared by the User model
 * (schema enum), the authorization middleware, and the auth controller.
 * Freezing the object prevents accidental mutation at runtime.
 */
const ROLES = Object.freeze({
  BRAND: 'brand',
  ARTISAN: 'artisan',
  ADMIN: 'admin',
});

// Roles a user may pick during public signup (admin is intentionally excluded).
const SIGNUP_ROLES = Object.freeze([ROLES.BRAND, ROLES.ARTISAN]);

const ROLE_VALUES = Object.freeze(Object.values(ROLES));

module.exports = { ROLES, ROLE_VALUES, SIGNUP_ROLES };
