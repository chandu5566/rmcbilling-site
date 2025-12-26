"""Mix Design Lambda Functions (QC Module)"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('mix_designs')

list_designs = handler['list']
get_design = handler['get_by_id']
create_design = handler['create']
update_design = handler['update']
delete_design = handler['delete']
