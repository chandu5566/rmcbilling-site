/**
 * Generic CRUD Lambda Functions Template
 * This provides reusable CRUD operations for simple tables
 */

const db = require('./db');
const auth = require('./auth');
const response = require('./response');
const { asyncHandler } = require('./errorHandler');

/**
 * Create a generic CRUD handler for a table
 */
const createCRUDHandler = (tableName, primaryKey = 'id') => {
  return {
    /**
     * List all records
     */
    list: asyncHandler(async (event) => {
      auth.validateRequest(event);

      const queryParams = event.queryStringParameters || {};
      const page = parseInt(queryParams.page) || 1;
      const limit = parseInt(queryParams.limit) || 50;
      const offset = (page - 1) * limit;

      const records = await db.query(
        `SELECT * FROM ${tableName} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const [{ total }] = await db.query(`SELECT COUNT(*) as total FROM ${tableName}`);

      return response.success({
        data: records,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    }),

    /**
     * Get record by ID
     */
    getById: asyncHandler(async (event) => {
      auth.validateRequest(event);
      const { id } = event.pathParameters;

      const records = await db.query(
        `SELECT * FROM ${tableName} WHERE ${primaryKey} = ?`,
        [id]
      );

      if (records.length === 0) {
        return response.notFound(tableName);
      }

      return response.success(records[0]);
    }),

    /**
     * Create a new record
     */
    create: asyncHandler(async (event) => {
      const user = auth.validateRequest(event);
      const body = JSON.parse(event.body);

      // Add audit fields
      body.created_by = user.id;
      body.created_at = new Date();

      const fields = Object.keys(body);
      const values = Object.values(body);
      const placeholders = fields.map(() => '?').join(', ');

      const result = await db.query(
        `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`,
        values
      );

      return response.success({
        id: result.insertId,
        message: `${tableName} created successfully`
      }, 201);
    }),

    /**
     * Update a record
     */
    update: asyncHandler(async (event) => {
      const user = auth.validateRequest(event);
      const { id } = event.pathParameters;
      const body = JSON.parse(event.body);

      const existing = await db.query(`SELECT ${primaryKey} FROM ${tableName} WHERE ${primaryKey} = ?`, [id]);
      if (existing.length === 0) {
        return response.notFound(tableName);
      }

      // Add audit fields
      body.updated_by = user.id;
      body.updated_at = new Date();

      const fields = Object.keys(body);
      const values = Object.values(body);
      const setClause = fields.map(field => `${field} = ?`).join(', ');

      await db.query(
        `UPDATE ${tableName} SET ${setClause} WHERE ${primaryKey} = ?`,
        [...values, id]
      );

      return response.success({ message: `${tableName} updated successfully` });
    }),

    /**
     * Delete a record
     */
    delete: asyncHandler(async (event) => {
      auth.validateRequest(event);
      const { id } = event.pathParameters;

      const existing = await db.query(`SELECT ${primaryKey} FROM ${tableName} WHERE ${primaryKey} = ?`, [id]);
      if (existing.length === 0) {
        return response.notFound(tableName);
      }

      await db.query(`DELETE FROM ${tableName} WHERE ${primaryKey} = ?`, [id]);

      return response.success({ message: `${tableName} deleted successfully` });
    })
  };
};

module.exports = { createCRUDHandler };
