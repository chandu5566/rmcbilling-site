/**
 * Dashboard Lambda Functions
 */
const db = require('../utils/db');
const auth = require('../utils/auth');
const response = require('../utils/response');
const { asyncHandler } = require('../utils/errorHandler');

// Constants
const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Get dashboard statistics
 * GET /dashboard/stats
 */
exports.stats = asyncHandler(async (event) => {
  auth.validateRequest(event);

  const [customerCount] = await db.query(
    'SELECT COUNT(*) as count FROM customers WHERE is_active = 1'
  );

  const [invoiceCount] = await db.query(
    'SELECT COUNT(*) as count FROM sales_invoices WHERE YEAR(invoice_date) = YEAR(CURDATE())'
  );

  const [revenueTotal] = await db.query(
    'SELECT SUM(total_amount) as total FROM sales_invoices WHERE YEAR(invoice_date) = YEAR(CURDATE())'
  );

  const [pendingOrders] = await db.query(
    'SELECT COUNT(*) as count FROM sales_orders WHERE status = ?',
    [ORDER_STATUS.PENDING]
  );

  return response.success({
    activeCustomers: customerCount[0].count,
    totalInvoices: invoiceCount[0].count,
    yearlyRevenue: revenueTotal[0].total || 0,
    pendingOrders: pendingOrders[0].count
  });
});

/**
 * Get quantity metrics
 * GET /dashboard/quantity
 */
exports.quantity = asyncHandler(async (event) => {
  auth.validateRequest(event);

  const [daily] = await db.query(
    `SELECT SUM(quantity) as total FROM delivery_challans 
     WHERE DATE(delivery_date) = CURDATE()`
  );

  const [weekly] = await db.query(
    `SELECT SUM(quantity) as total FROM delivery_challans 
     WHERE YEARWEEK(delivery_date) = YEARWEEK(CURDATE())`
  );

  const [monthly] = await db.query(
    `SELECT SUM(quantity) as total FROM delivery_challans 
     WHERE YEAR(delivery_date) = YEAR(CURDATE()) AND MONTH(delivery_date) = MONTH(CURDATE())`
  );

  return response.success({
    daily: daily[0].total || 0,
    weekly: weekly[0].total || 0,
    monthly: monthly[0].total || 0
  });
});

/**
 * Get dashboard summary
 * GET /dashboard/summary
 */
exports.summary = asyncHandler(async (event) => {
  auth.validateRequest(event);

  // Get recent activities
  const recentInvoices = await db.query(
    `SELECT id, invoice_number, total_amount, invoice_date 
     FROM sales_invoices 
     ORDER BY created_at DESC 
     LIMIT 5`
  );

  const recentOrders = await db.query(
    `SELECT id, order_number, status, order_date 
     FROM sales_orders 
     ORDER BY created_at DESC 
     LIMIT 5`
  );

  return response.success({
    recentInvoices,
    recentOrders
  });
});
