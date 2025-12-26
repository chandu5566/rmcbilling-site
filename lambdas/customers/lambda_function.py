"""
Customer Management Lambda Functions
Handles CRUD operations for customers
"""

import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import db, auth, response
from utils.error_handler import async_handler


@async_handler
def list_customers(event, context):
    """List all customers - GET /customers"""
    auth.validate_request(event)
    
    query_params = event.get('queryStringParameters') or {}
    page = int(query_params.get('page', 1))
    limit = int(query_params.get('limit', 50))
    offset = (page - 1) * limit
    search = query_params.get('search', '')
    
    sql = '''
        SELECT id, customer_name, contact_person, phone, email, gst_number,
               address, city, state, pincode, is_active, created_at, updated_at
        FROM customers
        WHERE 1=1
    '''
    params = []
    
    if search:
        sql += ' AND (customer_name LIKE %s OR contact_person LIKE %s OR phone LIKE %s OR email LIKE %s)'
        search_param = f'%{search}%'
        params.extend([search_param, search_param, search_param, search_param])
    
    sql += ' ORDER BY created_at DESC LIMIT %s OFFSET %s'
    params.extend([limit, offset])
    
    customers = db.query(sql, tuple(params))
    
    # Get total count
    count_sql = 'SELECT COUNT(*) as total FROM customers WHERE 1=1'
    count_params = []
    if search:
        count_sql += ' AND (customer_name LIKE %s OR contact_person LIKE %s OR phone LIKE %s OR email LIKE %s)'
        count_params = [search_param, search_param, search_param, search_param]
    
    total_result = db.query(count_sql, tuple(count_params))
    total = total_result[0]['total'] if total_result else 0
    
    return response.success({
        'customers': customers,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'totalPages': (total + limit - 1) // limit
        }
    })


@async_handler
def get_customer(event, context):
    """Get customer by ID - GET /customers/{id}"""
    auth.validate_request(event)
    
    customer_id = event['pathParameters']['id']
    customers = db.query(
        '''SELECT id, customer_name, contact_person, phone, email, gst_number,
                  address, city, state, pincode, is_active, created_at, updated_at
           FROM customers WHERE id = %s''',
        (customer_id,)
    )
    
    if not customers:
        return response.not_found('Customer')
    
    return response.success(customers[0])


@async_handler
def create_customer(event, context):
    """Create a new customer - POST /customers"""
    user = auth.validate_request(event)
    body = json.loads(event['body'])
    
    customer_name = body.get('customer_name')
    if not customer_name:
        return response.validation_error({'message': 'Customer name is required'})
    
    result = db.execute(
        '''INSERT INTO customers (
            customer_name, contact_person, phone, email, gst_number,
            address, city, state, pincode, is_active, created_by, created_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())''',
        (
            body.get('customer_name'),
            body.get('contact_person'),
            body.get('phone'),
            body.get('email'),
            body.get('gst_number'),
            body.get('address'),
            body.get('city'),
            body.get('state'),
            body.get('pincode'),
            body.get('is_active', 1),
            user['id']
        )
    )
    
    return response.success({
        'id': result['last_insert_id'],
        'message': 'Customer created successfully'
    }, 201)


@async_handler
def update_customer(event, context):
    """Update a customer - PUT /customers/{id}"""
    user = auth.validate_request(event)
    customer_id = event['pathParameters']['id']
    body = json.loads(event['body'])
    
    # Check if customer exists
    existing = db.query('SELECT id FROM customers WHERE id = %s', (customer_id,))
    if not existing:
        return response.not_found('Customer')
    
    db.execute(
        '''UPDATE customers SET
            customer_name = %s, contact_person = %s, phone = %s, email = %s,
            gst_number = %s, address = %s, city = %s, state = %s, pincode = %s,
            is_active = %s, updated_by = %s, updated_at = NOW()
        WHERE id = %s''',
        (
            body.get('customer_name'),
            body.get('contact_person'),
            body.get('phone'),
            body.get('email'),
            body.get('gst_number'),
            body.get('address'),
            body.get('city'),
            body.get('state'),
            body.get('pincode'),
            body.get('is_active'),
            user['id'],
            customer_id
        )
    )
    
    return response.success({'message': 'Customer updated successfully'})


@async_handler
def delete_customer(event, context):
    """Delete a customer - DELETE /customers/{id}"""
    auth.validate_request(event)
    customer_id = event['pathParameters']['id']
    
    # Check if customer exists
    existing = db.query('SELECT id FROM customers WHERE id = %s', (customer_id,))
    if not existing:
        return response.not_found('Customer')
    
    # Soft delete
    db.execute(
        'UPDATE customers SET is_active = 0, updated_at = NOW() WHERE id = %s',
        (customer_id,)
    )
    
    return response.success({'message': 'Customer deleted successfully'})
