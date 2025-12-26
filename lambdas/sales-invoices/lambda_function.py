"""
Sales Invoice Lambda Functions
Handles CRUD operations for sales invoices
"""

import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import db, auth, response
from utils.error_handler import async_handler


@async_handler
def list_invoices(event, context):
    """List all sales invoices - GET /sales-invoices"""
    auth.validate_request(event)
    
    query_params = event.get('queryStringParameters') or {}
    page = int(query_params.get('page', 1))
    limit = int(query_params.get('limit', 50))
    offset = (page - 1) * limit
    
    invoices = db.query(
        '''SELECT si.*, c.customer_name
           FROM sales_invoices si
           LEFT JOIN customers c ON si.customer_id = c.id
           ORDER BY si.invoice_date DESC, si.created_at DESC
           LIMIT %s OFFSET %s''',
        (limit, offset)
    )
    
    total_result = db.query('SELECT COUNT(*) as total FROM sales_invoices')
    total = total_result[0]['total'] if total_result else 0
    
    return response.success({
        'invoices': invoices,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'totalPages': (total + limit - 1) // limit
        }
    })


@async_handler
def get_invoice(event, context):
    """Get invoice by ID - GET /sales-invoices/{id}"""
    auth.validate_request(event)
    
    invoice_id = event['pathParameters']['id']
    invoices = db.query(
        '''SELECT si.*, c.customer_name
           FROM sales_invoices si
           LEFT JOIN customers c ON si.customer_id = c.id
           WHERE si.id = %s''',
        (invoice_id,)
    )
    
    if not invoices:
        return response.not_found('Sales Invoice')
    
    # Get invoice items
    items = db.query(
        'SELECT * FROM sales_invoice_items WHERE invoice_id = %s',
        (invoice_id,)
    )
    
    invoice = invoices[0]
    invoice['items'] = items
    
    return response.success(invoice)


@async_handler
def create_invoice(event, context):
    """Create a new sales invoice - POST /sales-invoices"""
    user = auth.validate_request(event)
    body = json.loads(event['body'])
    
    customer_id = body.get('customer_id')
    invoice_number = body.get('invoice_number')
    items = body.get('items', [])
    
    if not customer_id or not invoice_number or not items:
        return response.validation_error({'message': 'Required fields missing'})
    
    # Insert invoice
    result = db.execute(
        '''INSERT INTO sales_invoices (
            customer_id, invoice_number, invoice_date, due_date,
            subtotal, tax_amount, discount_amount, total_amount, notes,
            created_by, created_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())''',
        (
            customer_id,
            invoice_number,
            body.get('invoice_date'),
            body.get('due_date'),
            body.get('subtotal'),
            body.get('tax_amount'),
            body.get('discount_amount'),
            body.get('total_amount'),
            body.get('notes'),
            user['id']
        )
    )
    
    invoice_id = result['last_insert_id']
    
    # Insert items
    for item in items:
        db.execute(
            '''INSERT INTO sales_invoice_items (
                invoice_id, item_description, quantity, unit_price, tax_rate, amount
            ) VALUES (%s, %s, %s, %s, %s, %s)''',
            (
                invoice_id,
                item.get('item_description'),
                item.get('quantity'),
                item.get('unit_price'),
                item.get('tax_rate'),
                item.get('amount')
            )
        )
    
    return response.success({
        'id': invoice_id,
        'message': 'Sales invoice created successfully'
    }, 201)


@async_handler
def update_invoice(event, context):
    """Update a sales invoice - PUT /sales-invoices/{id}"""
    user = auth.validate_request(event)
    invoice_id = event['pathParameters']['id']
    body = json.loads(event['body'])
    
    # Check if invoice exists
    existing = db.query('SELECT id FROM sales_invoices WHERE id = %s', (invoice_id,))
    if not existing:
        return response.not_found('Sales Invoice')
    
    # Update invoice
    db.execute(
        '''UPDATE sales_invoices SET
            customer_id = %s, invoice_number = %s, invoice_date = %s, due_date = %s,
            subtotal = %s, tax_amount = %s, discount_amount = %s, total_amount = %s,
            notes = %s, updated_by = %s, updated_at = NOW()
        WHERE id = %s''',
        (
            body.get('customer_id'),
            body.get('invoice_number'),
            body.get('invoice_date'),
            body.get('due_date'),
            body.get('subtotal'),
            body.get('tax_amount'),
            body.get('discount_amount'),
            body.get('total_amount'),
            body.get('notes'),
            user['id'],
            invoice_id
        )
    )
    
    # Update items if provided
    items = body.get('items')
    if items is not None:
        db.execute('DELETE FROM sales_invoice_items WHERE invoice_id = %s', (invoice_id,))
        for item in items:
            db.execute(
                '''INSERT INTO sales_invoice_items (
                    invoice_id, item_description, quantity, unit_price, tax_rate, amount
                ) VALUES (%s, %s, %s, %s, %s, %s)''',
                (
                    invoice_id,
                    item.get('item_description'),
                    item.get('quantity'),
                    item.get('unit_price'),
                    item.get('tax_rate'),
                    item.get('amount')
                )
            )
    
    return response.success({'message': 'Sales invoice updated successfully'})


@async_handler
def delete_invoice(event, context):
    """Delete a sales invoice - DELETE /sales-invoices/{id}"""
    auth.validate_request(event)
    invoice_id = event['pathParameters']['id']
    
    # Check if invoice exists
    existing = db.query('SELECT id FROM sales_invoices WHERE id = %s', (invoice_id,))
    if not existing:
        return response.not_found('Sales Invoice')
    
    # Delete items and invoice
    db.execute('DELETE FROM sales_invoice_items WHERE invoice_id = %s', (invoice_id,))
    db.execute('DELETE FROM sales_invoices WHERE id = %s', (invoice_id,))
    
    return response.success({'message': 'Sales invoice deleted successfully'})
