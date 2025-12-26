/**
 * Customer Management Lambda Functions
 * Handles CRUD operations for customers
 */

const db = require('../utils/db');
const auth = require('../utils/auth');
const response = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');

/**
 * List all customers
 * GET /customers
 */
exports.list = asyncHandler(async (event) => {
  auth.validateRequest(event);

  const queryParams = event.queryStringParameters || {};
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 50;
  const offset = (page - 1) * limit;
  const search = queryParams.search || '';

  let sql = `
    SELECT id, customer_name, contact_person, phone, email, gst_number, 
           address, city, state, pincode, is_active, created_at, updated_at
    FROM customers
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += ` AND (customer_name LIKE ? OR contact_person LIKE ? OR phone LIKE ? OR email LIKE ?)`;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const customers = await db.query(sql, params);

  // Get total count
  const countSql = `SELECT COUNT(*) as total FROM customers WHERE 1=1 ${search ? 'AND (customer_name LIKE ? OR contact_person LIKE ? OR phone LIKE ? OR email LIKE ?)' : ''}`;
  const countParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`] : [];
  const [{ total }] = await db.query(countSql, countParams);

  return response.success({
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

/**
 * Get customer by ID
 * GET /customers/{id}
 */
exports.getById = asyncHandler(async (event) => {
  auth.validateRequest(event);

  const { id } = event.pathParameters;

  const customers = await db.query(
    `SELECT id, customer_name, contact_person, phone, email, gst_number, 
            address, city, state, pincode, is_active, created_at, updated_at
     FROM customers WHERE id = ?`,
    [id]
  );

  if (customers.length === 0) {
    return response.notFound('Customer');
  }

  return response.success(customers[0]);
});

/**
 * Create a new customer
 * POST /customers
 */
exports.create = asyncHandler(async (event) => {
  const user = auth.validateRequest(event);
  const body = JSON.parse(event.body);

  const {
    customer_name,
    contact_person,
    phone,
    email,
    gst_number,
    address,
    city,
    state,
    pincode,
    is_active = 1
  } = body;

  // Validate required fields
  if (!customer_name) {
    return response.validationError({ message: 'Customer name is required' });
  }

  const result = await db.query(
    `INSERT INTO customers (
      customer_name, contact_person, phone, email, gst_number, 
      address, city, state, pincode, is_active, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [customer_name, contact_person, phone, email, gst_number, address, city, state, pincode, is_active, user.id]
  );

  return response.success({
    id: result.insertId,
    message: 'Customer created successfully'
  }, 201);
});

/**
 * Update a customer
 * PUT /customers/{id}
 */
exports.update = asyncHandler(async (event) => {
  const user = auth.validateRequest(event);
  const { id } = event.pathParameters;
  const body = JSON.parse(event.body);

  const {
    customer_name,
    contact_person,
    phone,
    email,
    gst_number,
    address,
    city,
    state,
    pincode,
    is_active
  } = body;

  // Check if customer exists
  const existing = await db.query('SELECT id FROM customers WHERE id = ?', [id]);
  if (existing.length === 0) {
    return response.notFound('Customer');
  }

  await db.query(
    `UPDATE customers SET
      customer_name = ?,
      contact_person = ?,
      phone = ?,
      email = ?,
      gst_number = ?,
      address = ?,
      city = ?,
      state = ?,
      pincode = ?,
      is_active = ?,
      updated_by = ?,
      updated_at = NOW()
    WHERE id = ?`,
    [customer_name, contact_person, phone, email, gst_number, address, city, state, pincode, is_active, user.id, id]
  );

  return response.success({ message: 'Customer updated successfully' });
});

/**
 * Delete a customer
 * DELETE /customers/{id}
 */
exports.delete = asyncHandler(async (event) => {
  auth.validateRequest(event);
  const { id } = event.pathParameters;

  // Check if customer exists
  const existing = await db.query('SELECT id FROM customers WHERE id = ?', [id]);
  if (existing.length === 0) {
    return response.notFound('Customer');
  }

  // Soft delete
  await db.query(
    'UPDATE customers SET is_active = 0, updated_at = NOW() WHERE id = ?',
    [id]
  );

  return response.success({ message: 'Customer deleted successfully' });
});
