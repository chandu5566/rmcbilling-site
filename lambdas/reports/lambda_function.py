"""
Reports Lambda Functions
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import auth, response
from utils.error_handler import async_handler


@async_handler
def list_reports(event, context):
    """
    List available reports
    GET /reports
    """
    auth.validate_request(event)
    
    reports = [
        {'id': 'sales-summary', 'name': 'Sales Summary Report', 'type': 'pdf'},
        {'id': 'customer-statement', 'name': 'Customer Statement', 'type': 'pdf'},
        {'id': 'inventory-report', 'name': 'Inventory Report', 'type': 'excel'},
        {'id': 'qc-report', 'name': 'Quality Control Report', 'type': 'pdf'},
        {'id': 'financial-summary', 'name': 'Financial Summary', 'type': 'pdf'}
    ]
    
    return response.success(reports)


@async_handler
def preview(event, context):
    """
    Preview report
    GET /reports/preview
    """
    auth.validate_request(event)
    
    query_params = event.get('queryStringParameters') or {}
    report_id = query_params.get('report_id')
    
    # This would generate report data based on reportId
    return response.success({
        'reportId': report_id,
        'message': 'Report preview functionality to be implemented'
    })


@async_handler
def download(event, context):
    """
    Download report
    GET /reports/download
    """
    auth.validate_request(event)
    
    query_params = event.get('queryStringParameters') or {}
    report_id = query_params.get('report_id')
    
    # This would generate and return downloadable report
    return response.success({
        'reportId': report_id,
        'message': 'Report download functionality to be implemented'
    })
