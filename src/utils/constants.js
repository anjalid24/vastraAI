// User roles
const USER_ROLES = {
  FREE: 'free',
  BRAND: 'brand',
  ARTISAN: 'artisan',
  ADMIN: 'admin'
};

// Subscription plans
const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BRAND: 'brand'
};

// Pattern categories
const PATTERN_CATEGORIES = [
  'ikat',
  'bandhani',
  'patola',
  'ajrakh',
  'kalamkari',
  'chikankari',
  'banarasi',
  'kasavu',
  'pochampally',
  'paithani'
];

// Material categories
const MATERIAL_CATEGORIES = [
  'cotton',
  'silk',
  'wool',
  'linen',
  'polyester',
  'blend',
  'georgette',
  'chiffon'
];

// Difficulty levels
const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Notification types
const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MENTION: 'mention',
  REPLY: 'reply',
  BOOKMARK: 'bookmark',
  GENERATION_COMPLETE: 'generation_complete',
  DESIGN_SHARED: 'design_shared',
  PRICING_UPDATE: 'pricing_update',
  SUBSCRIPTION_EXPIRY: 'subscription_expiry',
  ARTISAN_REQUEST: 'artisan_request',
  ADMIN_MESSAGE: 'admin_message',
  SYSTEM: 'system'
};

// Report reasons
const REPORT_REASONS = [
  'spam',
  'harassment',
  'inappropriate_content',
  'copyright_infringement',
  'fake_information',
  'misleading',
  'other'
];

// Report status
const REPORT_STATUS = {
  PENDING: 'pending',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed'
};

// Community post categories
const COMMUNITY_CATEGORIES = [
  'design',
  'technique',
  'history',
  'question',
  'inspiration',
  'showcase',
  'discussion'
];

// AI Models
const AI_MODELS = [
  'stable-diffusion-v2',
  'stable-diffusion-xl',
  'dalle-3'
];

// Samplers
const SAMPLERS = [
  'Euler',
  'DPM++ 2M Karras',
  'LMS',
  'DDIM',
  'PLMS'
];

// API Responses
const API_RESPONSES = {
  SUCCESS: 'success',
  ERROR: 'error'
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Cache keys
const CACHE_KEYS = {
  PATTERNS: 'patterns',
  MATERIALS: 'materials',
  ARTISANS: 'artisans',
  ENCYCLOPEDIA: 'encyclopedia',
  USER_SESSION: 'user_session',
  GENERATION: 'generation'
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// File upload limits
const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm']
};

// Date formats
const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  DISPLAY: 'MMM D, YYYY',
  TIME: 'hh:mm A'
};

// Currency
const CURRENCY = {
  DEFAULT: 'INR',
  SYMBOL: '₹'
};

module.exports = {
  USER_ROLES,
  SUBSCRIPTION_PLANS,
  PATTERN_CATEGORIES,
  MATERIAL_CATEGORIES,
  DIFFICULTY_LEVELS,
  NOTIFICATION_TYPES,
  REPORT_REASONS,
  REPORT_STATUS,
  COMMUNITY_CATEGORIES,
  AI_MODELS,
  SAMPLERS,
  API_RESPONSES,
  HTTP_STATUS,
  CACHE_KEYS,
  PAGINATION,
  UPLOAD_LIMITS,
  DATE_FORMATS,
  CURRENCY
};