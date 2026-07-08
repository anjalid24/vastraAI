/**
 * Application roles. Kept in one place so models, middleware and
 * controllers share a single source of truth.
 */
const ROLES = Object.freeze({
  BRAND: 'brand',
  ARTISAN: 'artisan',
  ADMIN: 'admin',
});

const ROLE_VALUES = Object.values(ROLES);

module.exports = { ROLES, ROLE_VALUES };
