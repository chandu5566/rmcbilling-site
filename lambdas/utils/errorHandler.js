/**
 * Error Handler Utility
 * Centralized error handling for Lambda functions
 */

const response = require('./response');

/**
 * Handle errors and return appropriate response
 */
const handleError = (error) => {
  console.error('Error:', error);

  // Database errors
  if (error.code === 'ER_DUP_ENTRY') {
    return response.error('Duplicate entry. Record already exists.', 409);
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return response.error('Referenced record does not exist.', 400);
  }

  // JWT/Auth errors
  if (error.message && error.message.includes('token')) {
    return response.unauthorized(error.message);
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return response.validationError(error.details);
  }

  // Default error
  return response.error(
    error.message || 'An unexpected error occurred',
    error.statusCode || 500
  );
};

/**
 * Wrapper function to handle async errors
 */
const asyncHandler = (fn) => {
  return async (event, context) => {
    try {
      return await fn(event, context);
    } catch (error) {
      return handleError(error);
    }
  };
};

module.exports = {
  handleError,
  asyncHandler
};
