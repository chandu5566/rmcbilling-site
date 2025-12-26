"""
Error Handler Utility
Centralized error handling for Lambda functions
"""

from . import response
import traceback


def handle_error(error):
    """Handle errors and return appropriate response"""
    print(f'Error: {error}')
    traceback.print_exc()
    
    error_str = str(error)
    
    # Database errors
    if 'Duplicate entry' in error_str:
        return response.error('Duplicate entry. Record already exists.', 409)
    
    if 'foreign key constraint' in error_str.lower():
        return response.error('Referenced record does not exist.', 400)
    
    # JWT/Auth errors
    if 'token' in error_str.lower() or 'authorization' in error_str.lower():
        return response.unauthorized(error_str)
    
    # Validation errors
    if hasattr(error, 'name') and error.name == 'ValidationError':
        return response.validation_error(getattr(error, 'details', None))
    
    # Default error
    status_code = getattr(error, 'status_code', 500)
    return response.error(error_str or 'An unexpected error occurred', status_code)


def async_handler(func):
    """Decorator to handle async errors"""
    def wrapper(event, context):
        try:
            return func(event, context)
        except Exception as error:
            return handle_error(error)
    return wrapper
