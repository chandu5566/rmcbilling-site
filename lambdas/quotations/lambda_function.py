"""Quotation Lambda Functions"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('quotations')

list_quotations = handler['list']
get_quotation = handler['get_by_id']
create_quotation = handler['create']
update_quotation = handler['update']
delete_quotation = handler['delete']
