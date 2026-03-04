// User types
const USER_TYPES = {
  TRAVELER: 'traveler',
  SENDER: 'sender',
  BOTH: 'both'
};

// Slot statuses
const SLOT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Order statuses
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FLAGGED: 'flagged'
};

// Message types
const MESSAGE_TYPE = {
  TEXT: 'text',
  NOTIFICATION: 'notification',
  SYSTEM: 'system'
};

// File limits
const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf']
};

// API response codes
const API_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Verification thresholds
const VERIFICATION = {
  FACE_MATCH_THRESHOLD: 0.6, // Euclidean distance threshold
  MIN_LIVENESS_CONFIDENCE: 0.9,
  TICKET_MATCH_CONFIDENCE: 0.95
};

// Rating scales
const RATING = {
  MIN: 1,
  MAX: 5,
  DECIMAL_PLACES: 1
};

// Price limits (in currency units)
const PRICE = {
  MIN_PER_KG: 0.1,
  MAX_PER_KG: 500,
  MIN_BOOKING_FEE: 5
};

// Weight limits (in kg)
const WEIGHT = {
  MIN: 0.1,
  MAX: 100,
  MIN_TRAVELER_CAPACITY: 1
};

// Token expiry
const TOKEN_EXPIRY = {
  ACCESS: '30d',
  REFRESH: '90d'
};

module.exports = {
  USER_TYPES,
  SLOT_STATUS,
  ORDER_STATUS,
  MESSAGE_TYPE,
  FILE_LIMITS,
  API_CODES,
  PAGINATION,
  VERIFICATION,
  RATING,
  PRICE,
  WEIGHT,
  TOKEN_EXPIRY
};
