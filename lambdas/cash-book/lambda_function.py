"""
Cash Book Lambda Functions
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import db, auth, response
from utils.error_handler import async_handler
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('cash_book')

list_entries = handler['list']
get_entry = handler['get_by_id']
create_entry = handler['create']
update_entry = handler['update']
delete_entry = handler['delete']


@async_handler
def summary(event, context):
    """
    Get cash book summary
    GET /cash-book/summary
    """
    auth.validate_request(event)
    
    query_params = event.get('queryStringParameters') or {}
    start_date = query_params.get('start_date')
    end_date = query_params.get('end_date')
    
    sql = '''
        SELECT
            SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) as total_credit,
            SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) as total_debit,
            SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE -amount END) as balance
        FROM cash_book
        WHERE 1=1
    '''
    params = []
    
    if start_date:
        sql += ' AND transaction_date >= %s'
        params.append(start_date)
    
    if end_date:
        sql += ' AND transaction_date <= %s'
        params.append(end_date)
    
    summary_result = db.query(sql, tuple(params))
    
    return response.success(summary_result[0] if summary_result else {})
