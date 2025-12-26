"""
Database Connection Utility for RDS
Manages MySQL database connections with connection pooling
"""

import os
import pymysql
from pymysql.cursors import DictCursor
from contextlib import contextmanager

# Database configuration from environment variables
DB_CONFIG = {
    'host': os.environ.get('DB_HOST'),
    'user': os.environ.get('DB_USER'),
    'password': os.environ.get('DB_PASSWORD'),
    'database': os.environ.get('DB_NAME'),
    'port': int(os.environ.get('DB_PORT', 3306)),
    'charset': 'utf8mb4',
    'cursorclass': DictCursor,
    'autocommit': False
}


@contextmanager
def get_connection():
    """
    Get a database connection as a context manager
    Automatically closes connection when done
    """
    connection = None
    try:
        connection = pymysql.connect(**DB_CONFIG)
        yield connection
    finally:
        if connection:
            connection.close()


def query(sql, params=None):
    """
    Execute a query and return results
    
    Args:
        sql: SQL query string
        params: Query parameters (tuple or list)
    
    Returns:
        List of result dictionaries
    """
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, params or ())
            return cursor.fetchall()


def execute(sql, params=None):
    """
    Execute a query that modifies data (INSERT, UPDATE, DELETE)
    
    Args:
        sql: SQL query string
        params: Query parameters (tuple or list)
    
    Returns:
        Number of affected rows and last insert id
    """
    with get_connection() as connection:
        with connection.cursor() as cursor:
            affected_rows = cursor.execute(sql, params or ())
            connection.commit()
            return {
                'affected_rows': affected_rows,
                'last_insert_id': cursor.lastrowid
            }


def transaction(queries):
    """
    Execute multiple queries in a transaction
    
    Args:
        queries: List of dicts with 'sql' and 'params' keys
    
    Returns:
        List of results for each query
    """
    with get_connection() as connection:
        try:
            with connection.cursor() as cursor:
                results = []
                for query_dict in queries:
                    sql = query_dict['sql']
                    params = query_dict.get('params', ())
                    affected_rows = cursor.execute(sql, params)
                    results.append({
                        'affected_rows': affected_rows,
                        'last_insert_id': cursor.lastrowid
                    })
                connection.commit()
                return results
        except Exception as e:
            connection.rollback()
            raise e
