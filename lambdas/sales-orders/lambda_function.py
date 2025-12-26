"""Sales Order Lambda Functions"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('sales_orders')

list_orders = handler['list']
get_order = handler['get_by_id']
create_order = handler['create']
update_order = handler['update']
delete_order = handler['delete']
