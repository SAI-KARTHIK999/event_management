/**
 * User Registration Service Layer
 * Handles business logic for user registration, login, and profile management
 */
import bcrypt from 'bcrypt';
import pool from '../db.js';
import {
  createConflictError,
  createNotFoundError,
  createValidationError,
  createServerError,
  createUnauthorizedError,
} from '../utils/errors.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

/**
 * Check if email already exists
 */
export const checkEmailExists = async (email) => {
  const query = `
    SELECT "UserID" FROM "User" WHERE "Email" = $1 LIMIT 1
  `;

  try {
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  } catch (error) {
    throw createServerError(ERROR_CODES.DATABASE_ERROR, 'Error checking email');
  }
};

/**
 * Check if StudentID already exists
 */
export const checkStudentIDExists = async (studentID) => {
  const query = `
    SELECT "UserID" FROM "User" WHERE "StudentID" = $1 LIMIT 1
  `;

  try {
    const result = await pool.query(query, [studentID]);
    return result.rows.length > 0;
  } catch (error) {
    throw createServerError(ERROR_CODES.DATABASE_ERROR, 'Error checking student ID');
  }
};

/**
 * Check if username already exists
 */
export const checkUsernameExists = async (username) => {
  const query = `
    SELECT "UserID" FROM "User" WHERE "Username" = $1 LIMIT 1
  `;

  try {
    const result = await pool.query(query, [username]);
    return result.rows.length > 0;
  } catch (error) {
    throw createServerError(ERROR_CODES.DATABASE_ERROR, 'Error checking username');
  }
};

/**
 * Validate university exists
 */
export const validateUniversityExists = async (uniID) => {
  const query = `
    SELECT "UniID" FROM "University" WHERE "UniID" = $1
  `;

  try {
    const result = await pool.query(query, [uniID]);
    if (result.rows.length === 0) {
      throw createValidationError(
        ERROR_CODES.INVALID_INPUT,
        'Invalid University ID'
      );
    }
    return true;
  } catch (error) {
    if (error.statusCode) throw error;
    throw createServerError(ERROR_CODES.DATABASE_ERROR, 'Error validating university');
  }
};

/**
 * Validate branch exists
 */
export const validateBranchExists = async (branchID) => {
  const query = `
    SELECT "BranchID" FROM "Branch" WHERE "BranchID" = $1
  `;

  try {
    const result = await pool.query(query, [branchID]);
    if (result.rows.length === 0) {
      throw createValidationError(
        ERROR_CODES.INVALID_BRANCH,
        'Invalid Branch ID'
      );
    }
    return true;
  } catch (error) {
    if (error.statusCode) throw error;
    throw createServerError(ERROR_CODES.DATABASE_ERROR, 'Error validating branch');
  }
};

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw createServerError(ERROR_CODES.INTERNAL_ERROR, 'Error hashing password');
  }
};

/**
 * Verify password against hash
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw createServerError(ERROR_CODES.INTERNAL_ERROR, 'Error verifying password');
  }
};

/**
 * Register a new user
 */
export const registerUser = async (validatedData) => {
  // Check if email already exists
  const emailExists = await checkEmailExists(validatedData.email);
  if (emailExists) {
    throw createConflictError(
      ERROR_CODES.DUPLICATE_EMAIL,
      'Email already registered'
    );
  }

  // Check if StudentID already exists
  const studentIDExists = await checkStudentIDExists(validatedData.studentID);
  if (studentIDExists) {
    throw createConflictError(
      ERROR_CODES.DUPLICATE_STUDENT_ID,
      'Student ID already exists'
    );
  }

  // Check if username already exists
  const usernameExists = await checkUsernameExists(validatedData.username);
  if (usernameExists) {
    throw createConflictError(
      ERROR_CODES.DUPLICATE_USERNAME,
      'Username already exists'
    );
  }

  // Validate branch (mandatory)
  await validateBranchExists(validatedData.branchID);

  // Validate university (mandatory)
  await validateUniversityExists(validatedData.uniID);

  // Hash password
  const passwordHash = await hashPassword(validatedData.password);

  // Create user with transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO "User" (
        "StudentID",
        "FullName",
        "Username",
        "Email",
        "PasswordHash",
        "Phone",
        "UniID",
        "BranchID",
        "GraduationYear",
        "IsActive",
        "CreatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING 
        "UserID",
        "StudentID",
        "FullName",
        "Username",
        "Email",
        "Phone",
        "UniID",
        "BranchID",
        "GraduationYear",
        "IsActive",
        "CreatedAt"
    `;

    const result = await client.query(insertQuery, [
      validatedData.studentID,
      validatedData.fullName,
      validatedData.username,
      validatedData.email,
      passwordHash,
      validatedData.phone,
      validatedData.uniID,
      validatedData.branchID,
      validatedData.graduationYear,
      true, // IsActive defaults to true
    ]);

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');

    // Handle specific PostgreSQL errors
    if (error.code === '23505') {
      // Unique constraint violation
      if (error.constraint === 'User_Email_key') {
        throw createConflictError(ERROR_CODES.DUPLICATE_EMAIL, 'Email already registered');
      }
      if (error.constraint === 'User_StudentID_key') {
        throw createConflictError(ERROR_CODES.DUPLICATE_STUDENT_ID, 'Student ID already exists');
      }
      if (error.constraint === 'User_Username_key') {
        throw createConflictError(ERROR_CODES.DUPLICATE_USERNAME, 'Username already exists');
      }
    }

    if (error.statusCode) throw error;
    throw createServerError(ERROR_CODES.TRANSACTION_FAILED, 'Failed to create user account');
  } finally {
    client.release();
  }
};

/**
 * Get user by email (for login)
 */
export const getUserByEmail = async (email) => {
  const query = `
    SELECT 
      "UserID",
      "StudentID",
      "FullName",
      "Username",
      "Email",
      "PasswordHash",
      "Phone",
      "BranchID",
      "GraduationYear",
      "CurrentYear",
      "IsActive",
      "CreatedAt",
      "UpdatedAt"
    FROM "User"
    WHERE "Email" = $1 AND "IsActive" = true
  `;

  try {
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    throw createServerError(ERROR_CODES.DATABASE_ERROR, 'Error retrieving user');
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userID) => {
  const query = `
    SELECT 
      "UserID",
      "StudentID",
      "FullName",
      "Username",
      "Email",
      "Phone",
      "BranchID",
      "GraduationYear",
      "CurrentYear",
      "IsActive",
      "CreatedAt",
      "UpdatedAt"
    FROM "User"
    WHERE "UserID" = $1
  `;

  try {
    const result = await pool.query(query, [userID]);
    if (result.rows.length === 0) {
      throw createNotFoundError(
        ERROR_CODES.USER_NOT_FOUND,
        'User not found'
      );
    }
    return result.rows[0];
  } catch (error) {
    if (error.statusCode) throw error;
    throw createServerError(ERROR_CODES.DATABASE_ERROR, 'Error retrieving user');
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (email, password) => {
  const user = await getUserByEmail(email);

  if (!user) {
    // Generic error message for security - don't reveal if email exists
    throw createUnauthorizedError(
      ERROR_CODES.UNAUTHORIZED,
      'Invalid email or password'
    );
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.PasswordHash);
  if (!isPasswordValid) {
    throw createUnauthorizedError(
      ERROR_CODES.UNAUTHORIZED,
      'Invalid email or password'
    );
  }

  // Return user without password hash
  const { PasswordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userID, updateData) => {
  // Build dynamic update query
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (updateData.fullName) {
    updates.push(`"FullName" = $${paramCount}`);
    values.push(updateData.fullName);
    paramCount++;
  }

  if (updateData.phone) {
    updates.push(`"Phone" = $${paramCount}`);
    values.push(updateData.phone);
    paramCount++;
  }

  if (updateData.email) {
    const emailQuery = `SELECT "UserID" FROM "User" WHERE "Email" = $1 AND "UserID" != $2`;
    const emailResult = await pool.query(emailQuery, [updateData.email, userID]);
    if (emailResult.rows.length > 0) {
      throw createConflictError(ERROR_CODES.DUPLICATE_EMAIL, 'Email already in use');
    }
    updates.push(`"Email" = $${paramCount}`);
    values.push(updateData.email);
    paramCount++;
  }

  if (updateData.username) {
    const userQuery = `SELECT "UserID" FROM "User" WHERE "Username" = $1 AND "UserID" != $2`;
    const userResult = await pool.query(userQuery, [updateData.username, userID]);
    if (userResult.rows.length > 0) {
      throw createConflictError(ERROR_CODES.DUPLICATE_USERNAME, 'Username already in use');
    }
    updates.push(`"Username" = $${paramCount}`);
    values.push(updateData.username);
    paramCount++;
  }

  if (updateData.password) {
    // Fetch user's current password hash for verification
    const userQuery = 'SELECT "PasswordHash" FROM "User" WHERE "UserID" = $1';
    const userResult = await pool.query(userQuery, [userID]);

    if (userResult.rows.length === 0) {
      throw createNotFoundError(ERROR_CODES.USER_NOT_FOUND, 'User not found');
    }

    const currentPasswordHash = userResult.rows[0].PasswordHash;

    // Verify old password first
    const isPasswordValid = await verifyPassword(updateData.oldPassword, currentPasswordHash);
    if (!isPasswordValid) {
      throw createUnauthorizedError(
        ERROR_CODES.UNAUTHORIZED,
        'Old password is incorrect'
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(updateData.password);
    updates.push(`"PasswordHash" = $${paramCount}`);
    values.push(newPasswordHash);
    paramCount++;
  }

  if (updates.length === 0) {
    throw createValidationError(
      ERROR_CODES.INVALID_INPUT,
      'No fields to update'
    );
  }

  // Add UpdatedAt timestamp
  updates.push(`"UpdatedAt" = NOW()`);

  // Add UserID as the last parameter for the WHERE clause
  values.push(userID);
  const whereParamIndex = paramCount;

  const query = `
    UPDATE "User"
    SET ${updates.join(', ')}
    WHERE "UserID" = $${whereParamIndex}
    RETURNING 
      "UserID",
      "StudentID",
      "FullName",
      "Username",
      "Email",
      "Phone",
      "BranchID",
      "GraduationYear",
      "CurrentYear",
      "IsActive",
      "CreatedAt",
      "UpdatedAt"
  `;

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    if (error.statusCode) throw error;
    throw createServerError(ERROR_CODES.DATABASE_ERROR, 'Error updating user profile');
  }
};
