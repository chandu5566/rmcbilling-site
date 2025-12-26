"""
Generic CRUD Lambda Functions Template
This provides reusable CRUD operations for simple tables
"""

import json
from . import db, auth, response
from .error_handler import async_handler


def create_crud_handler(table_name, primary_key='id'):
    """
    Create a generic CRUD handler for a table
    
    Args:
        table_name: Name of the database table
        primary_key: Primary key column name (default: 'id')
    
    Returns:
        Dictionary with CRUD handler functions
    """
    
    @async_handler
    def list_handler(event, context):
        """List all records"""
        auth.validate_request(event)
        
        query_params = event.get('queryStringParameters') or {}
        page = int(query_params.get('page', 1))
        limit = int(query_params.get('limit', 50))
        offset = (page - 1) * limit
        
        records = db.query(
            f'SELECT * FROM {table_name} ORDER BY created_at DESC LIMIT %s OFFSET %s',
            (limit, offset)
        )
        
        total = db.query(f'SELECT COUNT(*) as total FROM {table_name}')
        total_count = total[0]['total'] if total else 0
        
        return response.success({
            'data': records,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'totalPages': (total_count + limit - 1) // limit
            }
        })
    
    @async_handler
    def get_by_id_handler(event, context):
        """Get record by ID"""
        auth.validate_request(event)
        
        record_id = event['pathParameters']['id']
        records = db.query(
            f'SELECT * FROM {table_name} WHERE {primary_key} = %s',
            (record_id,)
        )
        
        if not records:
            return response.not_found(table_name)
        
        return response.success(records[0])
    
    @async_handler
    def create_handler(event, context):
        """Create a new record"""
        user = auth.validate_request(event)
        body = json.loads(event['body'])
        
        # Add audit fields
        body['created_by'] = user['id']
        
        fields = list(body.keys())
        values = list(body.values())
        placeholders = ', '.join(['%s'] * len(fields))
        
        result = db.execute(
            f"INSERT INTO {table_name} ({', '.join(fields)}) VALUES ({placeholders})",
            tuple(values)
        )
        
        return response.success({
            'id': result['last_insert_id'],
            'message': f'{table_name} created successfully'
        }, 201)
    
    @async_handler
    def update_handler(event, context):
        """Update a record"""
        user = auth.validate_request(event)
        record_id = event['pathParameters']['id']
        body = json.loads(event['body'])
        
        # Check if record exists
        existing = db.query(
            f'SELECT {primary_key} FROM {table_name} WHERE {primary_key} = %s',
            (record_id,)
        )
        if not existing:
            return response.not_found(table_name)
        
        # Add audit fields
        body['updated_by'] = user['id']
        
        fields = list(body.keys())
        values = list(body.values())
        set_clause = ', '.join([f'{field} = %s' for field in fields])
        
        db.execute(
            f'UPDATE {table_name} SET {set_clause} WHERE {primary_key} = %s',
            tuple(values + [record_id])
        )
        
        return response.success({'message': f'{table_name} updated successfully'})
    
    @async_handler
    def delete_handler(event, context):
        """Delete a record"""
        auth.validate_request(event)
        record_id = event['pathParameters']['id']
        
        # Check if record exists
        existing = db.query(
            f'SELECT {primary_key} FROM {table_name} WHERE {primary_key} = %s',
            (record_id,)
        )
        if not existing:
            return response.not_found(table_name)
        
        db.execute(
            f'DELETE FROM {table_name} WHERE {primary_key} = %s',
            (record_id,)
        )
        
        return response.success({'message': f'{table_name} deleted successfully'})
    
    return {
        'list': list_handler,
        'get_by_id': get_by_id_handler,
        'create': create_handler,
        'update': update_handler,
        'delete': delete_handler
    }
