"""
Dashboard Lambda Functions
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import db, auth, response
from utils.error_handler import async_handler

# Constants
ORDER_STATUS = {
    'PENDING': 'pending',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
}


@async_handler
def stats(event, context):
    """
    Get dashboard statistics
    GET /dashboard/stats
    """
    auth.validate_request(event)
    
    customer_count = db.query('SELECT COUNT(*) as count FROM customers WHERE is_active = 1')
    invoice_count = db.query('SELECT COUNT(*) as count FROM sales_invoices WHERE YEAR(invoice_date) = YEAR(CURDATE())')
    revenue_total = db.query('SELECT SUM(total_amount) as total FROM sales_invoices WHERE YEAR(invoice_date) = YEAR(CURDATE())')
    pending_orders = db.query('SELECT COUNT(*) as count FROM sales_orders WHERE status = %s', (ORDER_STATUS['PENDING'],))
    
    return response.success({
        'activeCustomers': customer_count[0]['count'] if customer_count else 0,
        'totalInvoices': invoice_count[0]['count'] if invoice_count else 0,
        'yearlyRevenue': revenue_total[0]['total'] if revenue_total and revenue_total[0]['total'] else 0,
        'pendingOrders': pending_orders[0]['count'] if pending_orders else 0
    })


@async_handler
def quantity(event, context):
    """
    Get quantity metrics
    GET /dashboard/quantity
    """
    auth.validate_request(event)
    
    daily = db.query('SELECT SUM(quantity) as total FROM delivery_challans WHERE DATE(delivery_date) = CURDATE()')
    weekly = db.query('SELECT SUM(quantity) as total FROM delivery_challans WHERE YEARWEEK(delivery_date) = YEARWEEK(CURDATE())')
    monthly = db.query('SELECT SUM(quantity) as total FROM delivery_challans WHERE YEAR(delivery_date) = YEAR(CURDATE()) AND MONTH(delivery_date) = MONTH(CURDATE())')
    
    return response.success({
        'daily': daily[0]['total'] if daily and daily[0]['total'] else 0,
        'weekly': weekly[0]['total'] if weekly and weekly[0]['total'] else 0,
        'monthly': monthly[0]['total'] if monthly and monthly[0]['total'] else 0
    })


@async_handler
def summary_handler(event, context):
    """
    Get dashboard summary
    GET /dashboard/summary
    """
    auth.validate_request(event)
    
    recent_invoices = db.query('''
        SELECT id, invoice_number, total_amount, invoice_date
        FROM sales_invoices
        ORDER BY created_at DESC
        LIMIT 5
    ''')
    
    recent_orders = db.query('''
        SELECT id, order_number, status, order_date
        FROM sales_orders
        ORDER BY created_at DESC
        LIMIT 5
    ''')
    
    return response.success({
        'recentInvoices': recent_invoices,
        'recentOrders': recent_orders
    })
