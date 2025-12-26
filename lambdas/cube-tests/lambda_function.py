"""Cube Test Lambda Functions (QC Module)"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('cube_tests')

list_tests = handler['list']
get_test = handler['get_by_id']
create_test = handler['create']
update_test = handler['update']
delete_test = handler['delete']
