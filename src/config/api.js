// Centralized API Configuration for RMC Billing Site
// This file contains all API endpoints and configuration details

const API_CONFIG = {
  // Base URL for API - Update this to point to your backend server
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      VALIDATE: '/auth/validate',
      REFRESH: '/auth/refresh',
    },
    
    // Reports endpoints
    REPORTS: {
      DOWNLOAD: '/reports/download',
      PREVIEW: '/reports/preview',
      LIST: '/reports',
    },
    
    // Sales Invoice endpoints
    SALES_INVOICE: {
      LIST: '/sales-invoices',
      CREATE: '/sales-invoices',
      UPDATE: '/sales-invoices',
      DELETE: '/sales-invoices',
      GET_BY_ID: '/sales-invoices',
    },
    
    // Delivery Challan endpoints
    DELIVERY_CHALLAN: {
      LIST: '/delivery-challans',
      CREATE: '/delivery-challans',
      UPDATE: '/delivery-challans',
      DELETE: '/delivery-challans',
      GET_BY_ID: '/delivery-challans',
    },
    
    // Weight Bridge endpoints
    WEIGHT_BRIDGE: {
      LIST: '/weight-bridge-reports',
      CREATE: '/weight-bridge-reports',
      UPDATE: '/weight-bridge-reports',
      DELETE: '/weight-bridge-reports',
      GET_BY_ID: '/weight-bridge-reports',
    },
    
    // Customer endpoints
    CUSTOMER: {
      LIST: '/customers',
      CREATE: '/customers',
      UPDATE: '/customers',
      DELETE: '/customers',
      GET_BY_ID: '/customers',
    },
    
    // Purchase Order endpoints
    PURCHASE_ORDER: {
      LIST: '/purchase-orders',
      CREATE: '/purchase-orders',
      UPDATE: '/purchase-orders',
      DELETE: '/purchase-orders',
      GET_BY_ID: '/purchase-orders',
      GENERATE: '/purchase-orders/generate',
    },
    
    // Sales Order endpoints
    SALES_ORDER: {
      LIST: '/sales-orders',
      CREATE: '/sales-orders',
      UPDATE: '/sales-orders',
      DELETE: '/sales-orders',
      GET_BY_ID: '/sales-orders',
      SCHEDULE: '/sales-orders/schedule',
    },
    
    // Quotation endpoints
    QUOTATION: {
      LIST: '/quotations',
      CREATE: '/quotations',
      UPDATE: '/quotations',
      DELETE: '/quotations',
      GET_BY_ID: '/quotations',
      GENERATE: '/quotations/generate',
    },
    
    // Mix Design endpoints (QC)
    MIX_DESIGN: {
      LIST: '/mix-designs',
      CREATE: '/mix-designs',
      UPDATE: '/mix-designs',
      DELETE: '/mix-designs',
      GET_BY_ID: '/mix-designs',
    },
    
    // Recipe endpoints (QC)
    RECIPE: {
      LIST: '/recipes',
      CREATE: '/recipes',
      UPDATE: '/recipes',
      DELETE: '/recipes',
      GET_BY_ID: '/recipes',
    },
    
    // Cube Test endpoints (QC)
    CUBE_TEST: {
      LIST: '/cube-tests',
      CREATE: '/cube-tests',
      UPDATE: '/cube-tests',
      DELETE: '/cube-tests',
      GET_BY_ID: '/cube-tests',
    },
    
    // Batch List endpoints (QC)
    BATCH_LIST: {
      LIST: '/batch-lists',
      CREATE: '/batch-lists',
      UPDATE: '/batch-lists',
      DELETE: '/batch-lists',
      GET_BY_ID: '/batch-lists',
    },
    
    // Aggregates endpoints
    AGGREGATES: {
      LIST: '/aggregates',
      CREATE: '/aggregates',
      UPDATE: '/aggregates',
      DELETE: '/aggregates',
      GET_BY_ID: '/aggregates',
      BY_VENDOR: '/aggregates/by-vendor',
      PAYMENT_PENDING: '/aggregates/payment-pending',
    },
    
    // Cash Book endpoints
    CASH_BOOK: {
      LIST: '/cash-book',
      CREATE: '/cash-book',
      UPDATE: '/cash-book',
      DELETE: '/cash-book',
      GET_BY_ID: '/cash-book',
      SUMMARY: '/cash-book/summary',
    },
    
    // Dashboard endpoints
    DASHBOARD: {
      STATS: '/dashboard/stats',
      QUANTITY: '/dashboard/quantity',
      SUMMARY: '/dashboard/summary',
    },
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;
