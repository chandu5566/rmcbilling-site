"""
Authentication Lambda Functions
Handles user login, logout, validation, and token refresh
"""

import json
import sys
import os

# Add utils to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import db, auth, response
from utils.error_handler import async_handler


@async_handler
def login(event, context):
    """
    User Login
    POST /auth/login
    """
    body = json.loads(event['body'])
    username = body.get('username')
    password = body.get('password')
    
    # Validate input
    if not username or not password:
        return response.validation_error({'message': 'Username and password are required'})
    
    # Query user from database
    users = db.query(
        'SELECT id, username, password_hash, email, full_name, role FROM users WHERE username = %s AND is_active = 1',
        (username,)
    )
    
    if not users:
        return response.unauthorized('Invalid username or password')
    
    user = users[0]
    
    # Verify password
    is_valid_password = auth.compare_password(password, user['password_hash'])
    if not is_valid_password:
        return response.unauthorized('Invalid username or password')
    
    # Generate JWT token
    token = auth.generate_token({
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'role': user['role']
    })
    
    # Update last login
    db.execute(
        'UPDATE users SET last_login = NOW() WHERE id = %s',
        (user['id'],)
    )
    
    return response.success({
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'fullName': user['full_name'],
            'role': user['role']
        }
    })


@async_handler
def validate(event, context):
    """
    Validate Token
    GET /auth/validate
    """
    decoded = auth.validate_request(event)
    
    # Check if user still exists and is active
    users = db.query(
        'SELECT id, username, email, full_name, role FROM users WHERE id = %s AND is_active = 1',
        (decoded['id'],)
    )
    
    if not users:
        return response.unauthorized('User not found or inactive')
    
    user = users[0]
    return response.success({
        'valid': True,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'fullName': user['full_name'],
            'role': user['role']
        }
    })


@async_handler
def refresh(event, context):
    """
    Refresh Token
    POST /auth/refresh
    """
    decoded = auth.validate_request(event)
    
    # Generate new token
    token = auth.generate_token({
        'id': decoded['id'],
        'username': decoded['username'],
        'email': decoded['email'],
        'role': decoded['role']
    })
    
    return response.success({'token': token})


@async_handler
def logout(event, context):
    """
    Logout
    POST /auth/logout
    """
    # In a stateless JWT system, logout is handled client-side
    # This endpoint exists for consistency and can be extended
    # to implement token blacklisting if needed
    return response.success({'message': 'Logged out successfully'})
