"""Weight Bridge Lambda Functions"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('weight_bridge_reports')

list_reports = handler['list']
get_report = handler['get_by_id']
create_report = handler['create']
update_report = handler['update']
delete_report = handler['delete']
