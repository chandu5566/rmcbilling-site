"""
Aggregates Lambda Functions
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import db, auth, response
from utils.error_handler import async_handler
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('aggregates')

list_aggregates = handler['list']
get_aggregate = handler['get_by_id']
create_aggregate = handler['create']
update_aggregate = handler['update']
delete_aggregate = handler['delete']


@async_handler
def by_vendor(event, context):
    """
    Get aggregates by vendor
    GET /aggregates/by-vendor
    """
    auth.validate_request(event)
    
    aggregates = db.query('''
        SELECT vendor_name,
               SUM(quantity) as total_quantity,
               SUM(amount) as total_amount
        FROM aggregates
        GROUP BY vendor_name
        ORDER BY vendor_name
    ''')
    
    return response.success(aggregates)


@async_handler
def payment_pending(event, context):
    """
    Get payment pending aggregates
    GET /aggregates/payment-pending
    """
    auth.validate_request(event)
    
    aggregates = db.query('''
        SELECT * FROM aggregates
        WHERE payment_status = 'pending' OR payment_status IS NULL
        ORDER BY created_at DESC
    ''')
    
    return response.success(aggregates)
