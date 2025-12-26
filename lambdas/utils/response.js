/**
 * Response Formatter Utility
 * Standardizes API responses for consistency
 */

/**
 * Success response
 */
const success = (data, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify({
      success: true,
      data
    })
  };
};

/**
 * Error response
 */
const error = (message, statusCode = 500, details = null) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify({
      success: false,
      message,
      details: details || undefined
    })
  };
};

/**
 * Validation error response
 */
const validationError = (errors) => {
  return error('Validation failed', 400, errors);
};

/**
 * Not found response
 */
const notFound = (resource = 'Resource') => {
  return error(`${resource} not found`, 404);
};

/**
 * Unauthorized response
 */
const unauthorized = (message = 'Unauthorized') => {
  return error(message, 401);
};

/**
 * Forbidden response
 */
const forbidden = (message = 'Forbidden') => {
  return error(message, 403);
};

module.exports = {
  success,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden
};
