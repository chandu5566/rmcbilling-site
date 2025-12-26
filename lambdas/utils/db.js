/**
 * Database Connection Utility for RDS
 * Manages MySQL database connections with connection pooling
 */

const mysql = require('mysql2/promise');

// Create a connection pool for better performance
let pool;

/**
 * Initialize database connection pool
 */
const initPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return pool;
};

/**
 * Get a database connection from the pool
 */
const getConnection = async () => {
  const pool = initPool();
  return await pool.getConnection();
};

/**
 * Execute a query with parameters
 */
const query = async (sql, params = []) => {
  const pool = initPool();
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Execute multiple queries in a transaction
 */
const transaction = async (queries) => {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { sql, params } of queries) {
      const [result] = await connection.execute(sql, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    console.error('Transaction error:', error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Close the connection pool
 */
const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

module.exports = {
  query,
  getConnection,
  transaction,
  closePool,
  initPool
};
