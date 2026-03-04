// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation errors
const validationErrors = {
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  INVALID_PHONE: 'Please provide a valid phone number',
  MISSING_FIELD: 'All required fields must be provided',
  INVALID_USER_TYPE: 'Invalid user type. Must be traveler, sender, or both',
  INVALID_RATING: 'Rating must be between 1 and 5',
  INVALID_STATUS: 'Invalid status provided'
};

// Auth errors
const authErrors = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists with this email',
  USER_NOT_FOUND: 'User not found',
  NOT_AUTHORIZED: 'Not authorized to perform this action',
  NOT_VERIFIED: 'User must complete biometric verification first',
  VERIFICATION_FAILED: 'Verification failed. Please try again',
  TOKEN_EXPIRED: 'Token has expired. Please login again'
};

// Order/Slot errors
const businessErrors = {
  SLOT_NOT_FOUND: 'Travel slot not found',
  ORDER_NOT_FOUND: 'Order not found',
  SLOT_NOT_AVAILABLE: 'Slot is not available',
  WEIGHT_EXCEEDS: 'Parcel weight exceeds available capacity',
  PARCEL_FLAGGED: 'Parcel flagged for review due to prohibited items',
  INVALID_STATUS_CHANGE: 'Invalid status change',
  CANNOT_CANCEL: 'Cannot cancel order at this stage'
};

// File errors
const fileErrors = {
  FILE_REQUIRED: 'File is required',
  INVALID_FILE_TYPE: 'Invalid file type. Only JPG, PNG, and PDF allowed',
  FILE_TOO_LARGE: 'File size exceeds 10MB limit',
  UPLOAD_FAILED: 'File upload failed'
};

module.exports = {
  AppError,
  validationErrors,
  authErrors,
  businessErrors,
  fileErrors
};
