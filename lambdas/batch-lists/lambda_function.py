"""Batch List Lambda Functions (QC Module)"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('batch_lists')

list_batches = handler['list']
get_batch = handler['get_by_id']
create_batch = handler['create']
update_batch = handler['update']
delete_batch = handler['delete']
