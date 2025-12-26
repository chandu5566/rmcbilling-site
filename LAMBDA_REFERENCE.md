# Lambda Functions Reference

This document provides a quick reference for all Lambda functions in the RMC Billing Site backend.

## Utility Functions

Located in `lambdas/utils/`:

### db.js
Database connection utility with connection pooling
- `query(sql, params)` - Execute a query
- `getConnection()` - Get a database connection
- `transaction(queries)` - Execute multiple queries in a transaction
- `closePool()` - Close the connection pool

### response.js
Response formatter for standardized API responses
- `success(data, statusCode)` - Success response
- `error(message, statusCode, details)` - Error response
- `validationError(errors)` - Validation error (400)
- `notFound(resource)` - Not found error (404)
- `unauthorized(message)` - Unauthorized error (401)
- `forbidden(message)` - Forbidden error (403)

### auth.js
Authentication utility for JWT tokens
- `generateToken(payload)` - Generate JWT token
- `verifyToken(token)` - Verify JWT token
- `extractToken(event)` - Extract token from Authorization header
- `validateRequest(event)` - Validate and decode token from event
- `hashPassword(password)` - Hash password using bcrypt
- `comparePassword(password, hash)` - Compare password with hash

### errorHandler.js
Error handling utility
- `handleError(error)` - Handle errors and return appropriate response
- `asyncHandler(fn)` - Wrapper function to handle async errors

### crudHandler.js
Generic CRUD operations template
- `createCRUDHandler(tableName, primaryKey)` - Create CRUD handler for a table
  - Returns: `{ list, getById, create, update, delete }`

## Lambda Function Modules

### Authentication (`lambdas/auth/`)
Handles user authentication and token management

**Exports:**
- `login(event)` - POST /auth/login
- `validate(event)` - GET /auth/validate
- `refresh(event)` - POST /auth/refresh
- `logout(event)` - POST /auth/logout

### Customers (`lambdas/customers/`)
Customer management operations

**Exports:**
- `list(event)` - GET /customers
- `getById(event)` - GET /customers/{id}
- `create(event)` - POST /customers
- `update(event)` - PUT /customers/{id}
- `delete(event)` - DELETE /customers/{id}

### Sales Invoices (`lambdas/sales-invoices/`)
Sales invoice management with line items

**Exports:**
- `list(event)` - GET /sales-invoices
- `getById(event)` - GET /sales-invoices/{id}
- `create(event)` - POST /sales-invoices
- `update(event)` - PUT /sales-invoices/{id}
- `delete(event)` - DELETE /sales-invoices/{id}

### Delivery Challans (`lambdas/delivery-challans/`)
Delivery challan management

**Exports:** Standard CRUD operations using `createCRUDHandler`

### Weight Bridge (`lambdas/weight-bridge/`)
Weight bridge report management

**Exports:** Standard CRUD operations using `createCRUDHandler`

### Purchase Orders (`lambdas/purchase-orders/`)
Purchase order management

**Exports:** Standard CRUD operations using `createCRUDHandler`

### Sales Orders (`lambdas/sales-orders/`)
Sales order management

**Exports:** Standard CRUD operations using `createCRUDHandler`

### Quotations (`lambdas/quotations/`)
Quotation management

**Exports:** Standard CRUD operations using `createCRUDHandler`

### Mix Designs (`lambdas/mix-designs/`)
QC module - Mix design management

**Exports:** Standard CRUD operations using `createCRUDHandler`

### Recipes (`lambdas/recipes/`)
QC module - Recipe management

**Exports:** Standard CRUD operations using `createCRUDHandler`

### Cube Tests (`lambdas/cube-tests/`)
QC module - Cube test management

**Exports:** Standard CRUD operations using `createCRUDHandler`

### Batch Lists (`lambdas/batch-lists/`)
QC module - Batch list management

**Exports:** Standard CRUD operations using `createCRUDHandler`

### Aggregates (`lambdas/aggregates/`)
Aggregates inventory management

**Exports:**
- Standard CRUD operations
- `byVendor(event)` - GET /aggregates/by-vendor
- `paymentPending(event)` - GET /aggregates/payment-pending

### Cash Book (`lambdas/cash-book/`)
Cash book entry management

**Exports:**
- Standard CRUD operations
- `summary(event)` - GET /cash-book/summary

### Dashboard (`lambdas/dashboard/`)
Dashboard statistics and metrics

**Exports:**
- `stats(event)` - GET /dashboard/stats
- `quantity(event)` - GET /dashboard/quantity
- `summary(event)` - GET /dashboard/summary

### Reports (`lambdas/reports/`)
Reports generation and management

**Exports:**
- `list(event)` - GET /reports
- `preview(event)` - GET /reports/preview
- `download(event)` - GET /reports/download

## CloudFormation Resources

### Network Resources
- VPC with CIDR 10.0.0.0/16
- 2 Public Subnets (10.0.1.0/24, 10.0.2.0/24)
- 2 Private Subnets (10.0.11.0/24, 10.0.12.0/24)
- Internet Gateway
- Route Tables
- Security Groups (Lambda, RDS)

### Database Resources
- RDS MySQL 8.0.35
- Instance Class: db.t3.micro
- Storage: 20GB gp2
- Multi-AZ: Disabled (enable for production)
- Automated Backups: 7 days retention

### Lambda Resources
- Runtime: Python 3.11
- Memory: 256 MB
- Timeout: 30 seconds
- VPC Configuration: Private subnets
- IAM Role: Lambda execution role with VPC access

### API Gateway Resources
- HTTP API (API Gateway v2)
- CORS enabled
- Stage: Environment-based (dev/staging/prod)
- Auto-deploy enabled

## Environment Variables

All Lambda functions have access to:
- `DB_HOST` - RDS endpoint
- `DB_PORT` - RDS port (3306)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRY` - Token expiry (default: 24h)

## Common Patterns

### Request Validation
```javascript
const user = auth.validateRequest(event);
// user contains decoded JWT payload
```

### Database Query
```javascript
const results = await db.query(
  'SELECT * FROM table WHERE id = ?',
  [id]
);
```

### Success Response
```javascript
return response.success(data, 200);
```

### Error Response
```javascript
return response.error('Error message', 500);
```

### Pagination
```javascript
const page = parseInt(queryParams.page) || 1;
const limit = parseInt(queryParams.limit) || 50;
const offset = (page - 1) * limit;
```

## Testing Lambda Functions Locally

Use AWS SAM or Serverless Framework for local testing:

```bash
# Using AWS SAM
sam local invoke AuthLambda --event test-events/login.json

# Using curl to test deployed function
curl -X POST https://<api-endpoint>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Best Practices

1. **Error Handling**: Always use `asyncHandler` wrapper
2. **Database Connections**: Use connection pooling (handled by db.js)
3. **Authentication**: Validate requests using `auth.validateRequest()`
4. **Response Format**: Use response utility functions for consistency
5. **Logging**: Use `console.log` for CloudWatch Logs
6. **Environment Variables**: Never hardcode secrets
7. **Transaction**: Use `db.transaction()` for multi-step operations
8. **Pagination**: Always implement pagination for list endpoints
9. **Input Validation**: Validate all user inputs
10. **SQL Injection**: Use parameterized queries

## Extending the Backend

To add a new Lambda function:

1. Create a new directory in `lambdas/`
2. Create `index.js` with exported handlers
3. Use utilities from `lambdas/utils/`
4. Update CloudFormation template with new Lambda resource
5. Add API Gateway integration and routes
6. Update `deploy-lambdas.sh` to include the new module
7. Test locally before deployment
8. Deploy using CloudFormation

## Support and Troubleshooting

- Check CloudWatch Logs for Lambda execution logs
- Use AWS X-Ray for tracing (enable in CloudFormation if needed)
- Monitor RDS performance metrics
- Review API Gateway access logs
- Test database connections from Lambda
- Verify security group rules for RDS access
