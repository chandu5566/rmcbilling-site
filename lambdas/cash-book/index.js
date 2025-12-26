/**
 * Cash Book Lambda Functions
 */
const db = require('../utils/db');
const auth = require('../utils/auth');
const response = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');
const { createCRUDHandler } = require('../utils/crudHandler');

const handler = createCRUDHandler('cash_book');

exports.list = handler.list;
exports.getById = handler.getById;
exports.create = handler.create;
exports.update = handler.update;
exports.delete = handler.delete;

/**
 * Get cash book summary
 * GET /cash-book/summary
 */
exports.summary = asyncHandler(async (event) => {
  auth.validateRequest(event);

  const queryParams = event.queryStringParameters || {};
  const startDate = queryParams.start_date;
  const endDate = queryParams.end_date;

  let sql = `
    SELECT 
      SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) as total_credit,
      SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) as total_debit,
      SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE -amount END) as balance
    FROM cash_book
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    sql += ' AND transaction_date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    sql += ' AND transaction_date <= ?';
    params.push(endDate);
  }

  const [summary] = await db.query(sql, params);

  return response.success(summary);
});
