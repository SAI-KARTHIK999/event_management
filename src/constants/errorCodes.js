/**
 * Error Codes and Messages for Admin Onboarding API
 */
export const ERROR_CODES = {
  // Validation Errors
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_GRADUATION_YEAR: 'INVALID_GRADUATION_YEAR',
  INVALID_PHONE: 'INVALID_PHONE',

  // Authentication & Authorization Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Database Errors
  DUPLICATE_STUDENT_ID: 'DUPLICATE_STUDENT_ID',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_ROLE: 'INVALID_ROLE',
  INVALID_BRANCH: 'INVALID_BRANCH',

  // Invitation Code Errors
  INVALID_INVITATION_CODE: 'INVALID_INVITATION_CODE',
  INVITATION_CODE_INACTIVE: 'INVITATION_CODE_INACTIVE',
  INVITATION_CODE_EXPIRED: 'INVITATION_CODE_EXPIRED',
  INVITATION_CODE_ALREADY_USED: 'INVITATION_CODE_ALREADY_USED',

  // User Registration Errors
  DUPLICATE_USERNAME: 'DUPLICATE_USERNAME',
  INVALID_USERNAME: 'INVALID_USERNAME',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Event Registration Errors
  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
  EVENT_FULL: 'EVENT_FULL',
  ALREADY_REGISTERED: 'ALREADY_REGISTERED',
  REGISTRATION_NOT_FOUND: 'REGISTRATION_NOT_FOUND',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  CANCELLATION_WINDOW_CLOSED: 'CANCELLATION_WINDOW_CLOSED',
  INVALID_REGISTRATION_STATUS: 'INVALID_REGISTRATION_STATUS',

  // Event Management Errors
  VENUE_NOT_FOUND: 'VENUE_NOT_FOUND',
  INVALID_MAX_SLOTS: 'INVALID_MAX_SLOTS',
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  EVENT_HAS_REGISTRATIONS: 'EVENT_HAS_REGISTRATIONS',
  EVENT_ALREADY_PUBLISHED: 'EVENT_ALREADY_PUBLISHED',
  EVENT_NOT_PUBLISHED: 'EVENT_NOT_PUBLISHED',
  INCOMPLETE_EVENT: 'INCOMPLETE_EVENT',
  NO_UPDATE_FIELDS: 'NO_UPDATE_FIELDS',
  DUPLICATE_EVENT: 'DUPLICATE_EVENT',

  // Payment Errors
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INVALID_PAYMENT_SIGNATURE: 'INVALID_PAYMENT_SIGNATURE',
  PAYMENT_VERIFICATION_FAILED: 'PAYMENT_VERIFICATION_FAILED',
  PAYMENT_NOT_FOUND: 'PAYMENT_NOT_FOUND',
  RAZORPAY_ERROR: 'RAZORPAY_ERROR',

  // Event Registration Errors (additional)
  EVENT_NOT_OPEN: 'EVENT_NOT_OPEN',

  // Server Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_INPUT]: 'Invalid input provided',
  [ERROR_CODES.MISSING_FIELD]: 'Required field is missing',
  [ERROR_CODES.INVALID_EMAIL]: 'Invalid email format',
  [ERROR_CODES.INVALID_PASSWORD]: 'Password does not meet security requirements',
  [ERROR_CODES.INVALID_GRADUATION_YEAR]: 'Graduation year must be between 2020 and 2035',
  [ERROR_CODES.INVALID_PHONE]: 'Invalid phone number format',
  [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized - Missing or invalid authentication',
  [ERROR_CODES.FORBIDDEN]: 'Forbidden - You do not have permission to access this resource',
  [ERROR_CODES.DUPLICATE_STUDENT_ID]: 'Student ID already exists',
  [ERROR_CODES.DUPLICATE_EMAIL]: 'Email already registered',
  [ERROR_CODES.INVALID_ROLE]: 'Invalid Role ID',
  [ERROR_CODES.INVALID_BRANCH]: 'Invalid Branch ID',
  [ERROR_CODES.INVALID_INVITATION_CODE]: 'Invitation code does not exist',
  [ERROR_CODES.INVITATION_CODE_INACTIVE]: 'Invitation code is inactive',
  [ERROR_CODES.INVITATION_CODE_EXPIRED]: 'Invitation code has expired',
  [ERROR_CODES.INVITATION_CODE_ALREADY_USED]: 'Invitation code has already been used',

  // User Registration Errors
  [ERROR_CODES.DUPLICATE_USERNAME]: 'Username already exists',
  [ERROR_CODES.INVALID_USERNAME]: 'Invalid username format',
  [ERROR_CODES.USER_NOT_FOUND]: 'User not found',

  // Event Registration Errors
  [ERROR_CODES.EVENT_NOT_FOUND]: 'Event not found',
  [ERROR_CODES.EVENT_FULL]: 'Event has reached maximum capacity',
  [ERROR_CODES.ALREADY_REGISTERED]: 'User is already registered for this event',
  [ERROR_CODES.REGISTRATION_NOT_FOUND]: 'Registration not found',
  [ERROR_CODES.INVALID_STATUS_TRANSITION]: 'Invalid registration status transition',
  [ERROR_CODES.CANCELLATION_WINDOW_CLOSED]: 'Cancellation window has closed for this event',
  [ERROR_CODES.INVALID_REGISTRATION_STATUS]: 'Invalid registration status value',

  [ERROR_CODES.VENUE_NOT_FOUND]: 'Venue not found',
  [ERROR_CODES.INVALID_MAX_SLOTS]: 'Max slots exceed venue capacity',
  [ERROR_CODES.INVALID_TIME_RANGE]: 'Invalid time range for event',
  [ERROR_CODES.EVENT_HAS_REGISTRATIONS]: 'Event has existing registrations',
  [ERROR_CODES.EVENT_ALREADY_PUBLISHED]: 'Event is already published',
  [ERROR_CODES.EVENT_NOT_PUBLISHED]: 'Event is not published',
  [ERROR_CODES.INCOMPLETE_EVENT]: 'Event details are incomplete',
  [ERROR_CODES.NO_UPDATE_FIELDS]: 'No valid fields provided for update',
  [ERROR_CODES.DUPLICATE_EVENT]: 'An event with the same name, start time, and venue already exists',
  [ERROR_CODES.DATABASE_ERROR]: 'Database error occurred',
  [ERROR_CODES.TRANSACTION_FAILED]: 'Transaction could not be completed',
  [ERROR_CODES.INTERNAL_ERROR]: 'Internal server error',

  // Payment Errors
  [ERROR_CODES.PAYMENT_FAILED]: 'Payment processing failed',
  [ERROR_CODES.INVALID_PAYMENT_SIGNATURE]: 'Payment signature verification failed',
  [ERROR_CODES.PAYMENT_VERIFICATION_FAILED]: 'Could not verify payment with gateway',
  [ERROR_CODES.PAYMENT_NOT_FOUND]: 'Payment record not found',
  [ERROR_CODES.RAZORPAY_ERROR]: 'Razorpay gateway error',
  [ERROR_CODES.EVENT_NOT_OPEN]: 'Event is not open for registration',
};

// Password validation rules
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL: true,
};

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/, // E.164 format
  STUDENT_ID: /^[A-Za-z0-9]{3,20}$/, // Alphanumeric, 3-20 chars
  INVITATION_CODE: /^[A-Z0-9]{8,20}$/, // Alphanumeric uppercase, 8-20 chars
};
