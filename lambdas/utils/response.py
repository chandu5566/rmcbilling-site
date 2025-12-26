"""
Response Formatter Utility
Standardizes API responses for consistency
"""

import json


def success(data, status_code=200):
    """Success response"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        'body': json.dumps({
            'success': True,
            'data': data
        })
    }


def error(message, status_code=500, details=None):
    """Error response"""
    body = {
        'success': False,
        'message': message
    }
    if details:
        body['details'] = details
    
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        'body': json.dumps(body)
    }


def validation_error(errors):
    """Validation error response"""
    return error('Validation failed', 400, errors)


def not_found(resource='Resource'):
    """Not found response"""
    return error(f'{resource} not found', 404)


def unauthorized(message='Unauthorized'):
    """Unauthorized response"""
    return error(message, 401)


def forbidden(message='Forbidden'):
    """Forbidden response"""
    return error(message, 403)
