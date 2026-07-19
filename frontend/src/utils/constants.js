// Shared constants used across the frontend.

// Account roles as understood by the backend (config/roles.js).
export const ROLES = {
  BRAND: 'brand',
  ARTISAN: 'artisan',
  ADMIN: 'admin',
};

// Roles a user may self-assign at signup (backend SIGNUP_ROLES).
export const SIGNUP_ROLES = [
  {
    value: 'brand',
    label: 'Brand',
    blurb: 'Design, generate and source fabrics for your label.',
    icon: '🏷️',
  },
  {
    value: 'artisan',
    label: 'Artisan',
    blurb: 'Showcase your craft and receive requests from brands.',
    icon: '🧵',
  },
];

export const ROLE_LABELS = {
  brand: 'Brand',
  artisan: 'Artisan',
  admin: 'Admin',
};

// Human-friendly badge colour per role (maps to theme chip classes).
export const ROLE_CHIP = {
  brand: 'v-chip',
  artisan: 'v-chip-emerald',
  admin: 'v-chip-saffron',
};

export const STUDIO_MATERIALS = ['Silk', 'Cotton', 'Georgette', 'Linen'];

// Shipping zones used by the Pricing Calculator (flat placeholder rates ₹).
export const SHIPPING_ZONES = [
  { value: 'local', label: 'Within state', rate: 80 },
  { value: 'domestic', label: 'Across India', rate: 160 },
  { value: 'intl', label: 'International', rate: 950 },
];
