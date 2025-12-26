"""Recipe Lambda Functions (QC Module)"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.crud_handler import create_crud_handler

handler = create_crud_handler('recipes')

list_recipes = handler['list']
get_recipe = handler['get_by_id']
create_recipe = handler['create']
update_recipe = handler['update']
delete_recipe = handler['delete']
