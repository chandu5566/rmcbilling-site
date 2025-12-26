"""Delivery Challan Lambda Functions"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('delivery_challans')

list_challans = handler['list']
get_challan = handler['get_by_id']
create_challan = handler['create']
update_challan = handler['update']
delete_challan = handler['delete']
