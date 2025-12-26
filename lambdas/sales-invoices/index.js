/**
 * Sales Invoice Lambda Functions
 * Handles CRUD operations for sales invoices
 */

const db = require('../utils/db');
const auth = require('../utils/auth');
const response = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');

/**
 * List all sales invoices
 * GET /sales-invoices
 */
exports.list = asyncHandler(async (event) => {
  auth.validateRequest(event);

  const queryParams = event.queryStringParameters || {};
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 50;
  const offset = (page - 1) * limit;

  const invoices = await db.query(
    `SELECT si.*, c.customer_name 
     FROM sales_invoices si
     LEFT JOIN customers c ON si.customer_id = c.id
     ORDER BY si.invoice_date DESC, si.created_at DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [{ total }] = await db.query('SELECT COUNT(*) as total FROM sales_invoices');

  return response.success({
    invoices,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

/**
 * Get invoice by ID
 * GET /sales-invoices/{id}
 */
exports.getById = asyncHandler(async (event) => {
  auth.validateRequest(event);
  const { id } = event.pathParameters;

  const invoices = await db.query(
    `SELECT si.*, c.customer_name 
     FROM sales_invoices si
     LEFT JOIN customers c ON si.customer_id = c.id
     WHERE si.id = ?`,
    [id]
  );

  if (invoices.length === 0) {
    return response.notFound('Sales Invoice');
  }

  // Get invoice items
  const items = await db.query(
    'SELECT * FROM sales_invoice_items WHERE invoice_id = ?',
    [id]
  );

  return response.success({ ...invoices[0], items });
});

/**
 * Create a new sales invoice
 * POST /sales-invoices
 */
exports.create = asyncHandler(async (event) => {
  const user = auth.validateRequest(event);
  const body = JSON.parse(event.body);

  const {
    customer_id,
    invoice_number,
    invoice_date,
    due_date,
    items,
    subtotal,
    tax_amount,
    discount_amount,
    total_amount,
    notes
  } = body;

  // Validate required fields
  if (!customer_id || !invoice_number || !items || items.length === 0) {
    return response.validationError({ message: 'Required fields missing' });
  }

  // Use transaction for invoice and items
  const queries = [
    {
      sql: `INSERT INTO sales_invoices (
        customer_id, invoice_number, invoice_date, due_date, 
        subtotal, tax_amount, discount_amount, total_amount, notes, 
        created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      params: [customer_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, discount_amount, total_amount, notes, user.id]
    }
  ];

  const results = await db.transaction(queries);
  const invoiceId = results[0].insertId;

  // Insert items
  for (const item of items) {
    await db.query(
      `INSERT INTO sales_invoice_items (
        invoice_id, item_description, quantity, unit_price, tax_rate, amount
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [invoiceId, item.item_description, item.quantity, item.unit_price, item.tax_rate, item.amount]
    );
  }

  return response.success({ id: invoiceId, message: 'Sales invoice created successfully' }, 201);
});

/**
 * Update a sales invoice
 * PUT /sales-invoices/{id}
 */
exports.update = asyncHandler(async (event) => {
  const user = auth.validateRequest(event);
  const { id } = event.pathParameters;
  const body = JSON.parse(event.body);

  const existing = await db.query('SELECT id FROM sales_invoices WHERE id = ?', [id]);
  if (existing.length === 0) {
    return response.notFound('Sales Invoice');
  }

  const {
    customer_id, invoice_number, invoice_date, due_date,
    subtotal, tax_amount, discount_amount, total_amount, notes, items
  } = body;

  await db.query(
    `UPDATE sales_invoices SET
      customer_id = ?, invoice_number = ?, invoice_date = ?, due_date = ?,
      subtotal = ?, tax_amount = ?, discount_amount = ?, total_amount = ?,
      notes = ?, updated_by = ?, updated_at = NOW()
    WHERE id = ?`,
    [customer_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, discount_amount, total_amount, notes, user.id, id]
  );

  if (items) {
    await db.query('DELETE FROM sales_invoice_items WHERE invoice_id = ?', [id]);
    for (const item of items) {
      await db.query(
        `INSERT INTO sales_invoice_items (
          invoice_id, item_description, quantity, unit_price, tax_rate, amount
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, item.item_description, item.quantity, item.unit_price, item.tax_rate, item.amount]
      );
    }
  }

  return response.success({ message: 'Sales invoice updated successfully' });
});

/**
 * Delete a sales invoice
 * DELETE /sales-invoices/{id}
 */
exports.delete = asyncHandler(async (event) => {
  auth.validateRequest(event);
  const { id } = event.pathParameters;

  const existing = await db.query('SELECT id FROM sales_invoices WHERE id = ?', [id]);
  if (existing.length === 0) {
    return response.notFound('Sales Invoice');
  }

  await db.query('DELETE FROM sales_invoice_items WHERE invoice_id = ?', [id]);
  await db.query('DELETE FROM sales_invoices WHERE id = ?', [id]);

  return response.success({ message: 'Sales invoice deleted successfully' });
});
