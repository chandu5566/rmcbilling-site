/**
 * Authentication Lambda Functions
 * Handles user login, logout, validation, and token refresh
 */

const db = require('../utils/db');
const auth = require('../utils/auth');
const response = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');

/**
 * User Login
 * POST /auth/login
 */
exports.login = asyncHandler(async (event) => {
  const body = JSON.parse(event.body);
  const { username, password } = body;

  // Validate input
  if (!username || !password) {
    return response.validationError({ message: 'Username and password are required' });
  }

  // Query user from database
  const users = await db.query(
    'SELECT id, username, password_hash, email, full_name, role FROM users WHERE username = ? AND is_active = 1',
    [username]
  );

  if (users.length === 0) {
    return response.unauthorized('Invalid username or password');
  }

  const user = users[0];

  // Verify password
  const isValidPassword = await auth.comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    return response.unauthorized('Invalid username or password');
  }

  // Generate JWT token
  const token = auth.generateToken({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  });

  // Update last login
  await db.query(
    'UPDATE users SET last_login = NOW() WHERE id = ?',
    [user.id]
  );

  return response.success({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role
    }
  });
});

/**
 * Validate Token
 * GET /auth/validate
 */
exports.validate = asyncHandler(async (event) => {
  const decoded = auth.validateRequest(event);
  
  // Check if user still exists and is active
  const users = await db.query(
    'SELECT id, username, email, full_name, role FROM users WHERE id = ? AND is_active = 1',
    [decoded.id]
  );

  if (users.length === 0) {
    return response.unauthorized('User not found or inactive');
  }

  return response.success({
    valid: true,
    user: {
      id: users[0].id,
      username: users[0].username,
      email: users[0].email,
      fullName: users[0].full_name,
      role: users[0].role
    }
  });
});

/**
 * Refresh Token
 * POST /auth/refresh
 */
exports.refresh = asyncHandler(async (event) => {
  const decoded = auth.validateRequest(event);
  
  // Generate new token
  const token = auth.generateToken({
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
    role: decoded.role
  });

  return response.success({ token });
});

/**
 * Logout
 * POST /auth/logout
 */
exports.logout = asyncHandler(async (event) => {
  // In a stateless JWT system, logout is handled client-side
  // This endpoint exists for consistency and can be extended
  // to implement token blacklisting if needed
  return response.success({ message: 'Logged out successfully' });
});
