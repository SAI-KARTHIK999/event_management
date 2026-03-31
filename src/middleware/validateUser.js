/**
 * Input validation middleware for User Registration endpoints
 */
import {
  validateEmail,
  validatePhone,
  validateStudentID,
  validatePassword,
  validateGraduationYear,
  validateFullName,
  validatePositiveInteger,
  validateUsername,
} from '../utils/validators.js';
import { createValidationError } from '../utils/errors.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

/**
 * Middleware to sanitize and validate user registration request body
 */
export const sanitizeUserInput = (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      throw createValidationError(ERROR_CODES.INVALID_INPUT, 'Request body must be a valid JSON object');
    }

    // Check for empty body
    if (Object.keys(req.body).length === 0) {
      throw createValidationError(ERROR_CODES.INVALID_INPUT, 'Request body cannot be empty');
    }

    next();
  } catch (error) {
    if (error.statusCode) {
      return next(error);
    }
    next(createValidationError(ERROR_CODES.INVALID_INPUT, error.message));
  }
};

/**
 * Middleware to validate user registration request
 */
export const validateUserRegistrationInput = (req, res, next) => {
  try {
    const { studentID, fullName, username, email, password, phone, branchID, graduationYear, uniID } = req.body;

    const validated = {};

    // Validate StudentID
    validated.studentID = validateStudentID(studentID);

    // Validate Full Name
    validated.fullName = validateFullName(fullName);

    // Validate Username
    validated.username = validateUsername(username);

    // Validate Email
    validated.email = validateEmail(email);

    // Validate Password
    validated.password = validatePassword(password);

    // Validate Phone
    validated.phone = validatePhone(phone);

    // Validate GraduationYear
    validated.graduationYear = validateGraduationYear(graduationYear);

    // Validate UniID (mandatory)
    validated.uniID = validatePositiveInteger(uniID, 'uniId');

    // Validate BranchID (mandatory)
    validated.branchID = validatePositiveInteger(branchID, 'branchId');

    // Merge validated data with existing request data
    req.validated = { ...(req.validated || {}), ...validated };
    next();
  } catch (error) {
    if (error.statusCode) {
      return next(error);
    }
    next(createValidationError(ERROR_CODES.INVALID_INPUT, error.message));
  }
};

/**
 * Middleware to validate user login request
 */
export const validateUserLoginInput = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createValidationError(ERROR_CODES.MISSING_FIELD, 'Email and password are required');
    }

    const validated = {};

    // Validate Email
    validated.email = validateEmail(email);

    // Validate Password (only format check, not strength for login)
    if (typeof password !== 'string' || password.length === 0) {
      throw createValidationError(ERROR_CODES.MISSING_FIELD, 'Password is required');
    }
    validated.password = password;

    req.validated = { ...(req.validated || {}), ...validated };
    next();
  } catch (error) {
    if (error.statusCode) {
      return next(error);
    }
    next(createValidationError(ERROR_CODES.INVALID_INPUT, error.message));
  }
};

/**
 * Middleware to validate user profile update request
 */
export const validateUserUpdateInput = (req, res, next) => {
  try {
    const { fullName, phone, password, oldPassword, email, username } = req.body;

    if (!fullName && !phone && !password && !email && !username) {
      throw createValidationError(
        ERROR_CODES.INVALID_INPUT,
        'At least one field (fullName, phone, password, email, or username) must be provided'
      );
    }

    const validated = {};

    // Validate Full Name (optional)
    if (fullName !== undefined && fullName !== null) {
      validated.fullName = validateFullName(fullName);
    }

    // Validate Phone (optional)
    if (phone !== undefined && phone !== null) {
      validated.phone = validatePhone(phone);
    }
    
    // Validate Email (optional)
    if (email !== undefined && email !== null) {
      validated.email = validateEmail(email);
    }
    
    // Validate Username (optional)
    if (username !== undefined && username !== null) {
      validated.username = validateUsername(username);
    }

    // Validate Password (optional but requires oldPassword)
    if (password !== undefined && password !== null) {
      if (!oldPassword) {
        throw createValidationError(
          ERROR_CODES.MISSING_FIELD,
          'Old password is required to change password'
        );
      }
      validated.password = validatePassword(password);
      validated.oldPassword = oldPassword;
    }

    req.validated = { ...(req.validated || {}), ...validated };
    next();
  } catch (error) {
    if (error.statusCode) {
      return next(error);
    }
    next(createValidationError(ERROR_CODES.INVALID_INPUT, error.message));
  }
};
