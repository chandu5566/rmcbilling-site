/**
 * Aggregates Lambda Functions
 */
const db = require('../utils/db');
const auth = require('../utils/auth');
const response = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');
const { createCRUDHandler } = require('../utils/crudHandler');

const handler = createCRUDHandler('aggregates');

exports.list = handler.list;
exports.getById = handler.getById;
exports.create = handler.create;
exports.update = handler.update;
exports.delete = handler.delete;

/**
 * Get aggregates by vendor
 * GET /aggregates/by-vendor
 */
exports.byVendor = asyncHandler(async (event) => {
  auth.validateRequest(event);

  const aggregates = await db.query(
    `SELECT vendor_name, 
            SUM(quantity) as total_quantity,
            SUM(amount) as total_amount
     FROM aggregates
     GROUP BY vendor_name
     ORDER BY vendor_name`
  );

  return response.success(aggregates);
});

/**
 * Get payment pending aggregates
 * GET /aggregates/payment-pending
 */
exports.paymentPending = asyncHandler(async (event) => {
  auth.validateRequest(event);

  const aggregates = await db.query(
    `SELECT * FROM aggregates 
     WHERE payment_status = 'pending' OR payment_status IS NULL
     ORDER BY created_at DESC`
  );

  return response.success(aggregates);
});
