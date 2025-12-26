"""
Authentication Utility
Handles JWT token validation and user authentication
"""

import os
import jwt
import bcrypt
from datetime import datetime, timedelta

JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_EXPIRY = os.environ.get('JWT_EXPIRY', '24h')

if not JWT_SECRET:
    raise ValueError('JWT_SECRET environment variable is required')


def _parse_expiry(expiry_str):
    """Parse expiry string like '24h' to timedelta"""
    if expiry_str.endswith('h'):
        hours = int(expiry_str[:-1])
        return timedelta(hours=hours)
    elif expiry_str.endswith('d'):
        days = int(expiry_str[:-1])
        return timedelta(days=days)
    else:
        return timedelta(hours=24)


def generate_token(payload):
    """Generate JWT token"""
    expiry = _parse_expiry(JWT_EXPIRY)
    payload['exp'] = datetime.utcnow() + expiry
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


def verify_token(token):
    """Verify JWT token"""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise Exception('Token has expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')


def extract_token(event):
    """Extract token from Authorization header"""
    headers = event.get('headers', {})
    auth_header = headers.get('Authorization') or headers.get('authorization')
    
    if not auth_header:
        raise Exception('No authorization header provided')
    
    parts = auth_header.split(' ')
    if len(parts) != 2 or parts[0] != 'Bearer':
        raise Exception('Invalid authorization header format')
    
    return parts[1]


def validate_request(event):
    """Validate and decode token from event"""
    token = extract_token(event)
    return verify_token(token)


def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def compare_password(password, password_hash):
    """Compare password with hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
