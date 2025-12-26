# AWS Lambda and CloudFormation Deployment Guide

This guide provides instructions for deploying the RMC Billing Site backend infrastructure using AWS Lambda, API Gateway, and RDS.

## Overview

The infrastructure includes:
- **AWS Lambda Functions**: Serverless backend functions for all API endpoints
- **API Gateway**: HTTP API for routing requests to Lambda functions
- **RDS MySQL Database**: Managed database for data persistence
- **VPC Configuration**: Isolated network with public and private subnets
- **Security Groups**: Network security for Lambda and RDS communication

## Prerequisites

1. **AWS Account**: Active AWS account with appropriate permissions
2. **AWS CLI**: Installed and configured
   ```bash
   aws --version
   aws configure
   ```
3. **Node.js**: Version 18.x or later (for local development/testing)
4. **MySQL Client**: For database schema setup (optional)

## Directory Structure

```
lambdas/
├── utils/                      # Shared utilities
│   ├── db.js                   # Database connection utility
│   ├── response.js             # Response formatter
│   ├── auth.js                 # Authentication utility
│   ├── errorHandler.js         # Error handling
│   └── crudHandler.js          # Generic CRUD operations
├── auth/                       # Authentication module
│   └── index.js
├── customers/                  # Customer management
│   └── index.js
├── sales-invoices/             # Sales invoice management
│   └── index.js
├── delivery-challans/          # Delivery challan management
│   └── index.js
├── weight-bridge/              # Weight bridge reports
│   └── index.js
├── purchase-orders/            # Purchase order management
│   └── index.js
├── sales-orders/               # Sales order management
│   └── index.js
├── quotations/                 # Quotation management
│   └── index.js
├── mix-designs/                # Mix design (QC)
│   └── index.js
├── recipes/                    # Recipe management (QC)
│   └── index.js
├── cube-tests/                 # Cube test (QC)
│   └── index.js
├── batch-lists/                # Batch list (QC)
│   └── index.js
├── aggregates/                 # Aggregates management
│   └── index.js
├── cash-book/                  # Cash book management
│   └── index.js
├── dashboard/                  # Dashboard endpoints
│   └── index.js
├── reports/                    # Reports module
│   └── index.js
└── package.json                # Node.js dependencies
```

## Deployment Steps

### Step 1: Prepare Lambda Function Code

1. Install Lambda dependencies:
   ```bash
   cd lambdas
   npm install
   ```

2. Package each Lambda function:
   ```bash
   # Create deployment packages for each module
   cd auth && zip -r auth.zip index.js ../utils/ ../node_modules/
   cd ../customers && zip -r customers.zip index.js ../utils/ ../node_modules/
   cd ../sales-invoices && zip -r sales-invoices.zip index.js ../utils/ ../node_modules/
   # ... repeat for other modules
   ```

   Or use a script to automate packaging:
   ```bash
   #!/bin/bash
   for dir in auth customers sales-invoices delivery-challans dashboard; do
     cd $dir
     zip -r ${dir}.zip index.js ../utils/ ../node_modules/
     cd ..
   done
   ```

### Step 2: Deploy CloudFormation Stack

1. Create parameters file (`parameters.json`):
   ```json
   [
     {
       "ParameterKey": "Environment",
       "ParameterValue": "dev"
     },
     {
       "ParameterKey": "DBUsername",
       "ParameterValue": "admin"
     },
     {
       "ParameterKey": "DBPassword",
       "ParameterValue": "YourSecurePassword123!"
     },
     {
       "ParameterKey": "DBName",
       "ParameterValue": "rmcbilling"
     },
     {
       "ParameterKey": "JWTSecret",
       "ParameterValue": "your-jwt-secret-key-min-32-characters-long"
     }
   ]
   ```

2. Deploy the CloudFormation stack:
   ```bash
   aws cloudformation create-stack \
     --stack-name rmcbilling-backend-dev \
     --template-body file://cloudformation-template.yaml \
     --parameters file://parameters.json \
     --capabilities CAPABILITY_NAMED_IAM \
     --region us-east-1
   ```

3. Monitor stack creation:
   ```bash
   aws cloudformation describe-stacks \
     --stack-name rmcbilling-backend-dev \
     --query 'Stacks[0].StackStatus'
   ```

4. Wait for stack creation to complete (typically 10-15 minutes for RDS):
   ```bash
   aws cloudformation wait stack-create-complete \
     --stack-name rmcbilling-backend-dev
   ```

### Step 3: Update Lambda Function Code

After the CloudFormation stack is created, update Lambda functions with actual code:

```bash
# Update each Lambda function
aws lambda update-function-code \
  --function-name dev-rmcbilling-auth \
  --zip-file fileb://lambdas/auth/auth.zip

aws lambda update-function-code \
  --function-name dev-rmcbilling-customers \
  --zip-file fileb://lambdas/customers/customers.zip

# ... repeat for other Lambda functions
```

### Step 4: Initialize Database Schema

1. Get RDS endpoint from CloudFormation outputs:
   ```bash
   aws cloudformation describe-stacks \
     --stack-name rmcbilling-backend-dev \
     --query 'Stacks[0].Outputs[?OutputKey==`RDSEndpoint`].OutputValue' \
     --output text
   ```

2. Connect to RDS and run schema:
   ```bash
   mysql -h <RDS_ENDPOINT> -u admin -p rmcbilling < database-schema.sql
   ```

   Or use a bastion host/Lambda function for secure access.

### Step 5: Get API Gateway Endpoint

```bash
aws cloudformation describe-stacks \
  --stack-name rmcbilling-backend-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

Update your frontend `.env` file:
```
VITE_API_BASE_URL=https://<api-id>.execute-api.us-east-1.amazonaws.com/dev/api
```

## Configuration

### Environment Variables

Lambda functions use the following environment variables (automatically set by CloudFormation):

- `DB_HOST`: RDS database endpoint
- `DB_PORT`: RDS database port (3306)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT token generation

### Database Connection

The `lambdas/utils/db.js` utility manages database connections using connection pooling for optimal performance.

### Authentication

- JWT-based authentication
- Tokens expire in 24 hours (configurable via JWT_EXPIRY environment variable)
- Default admin credentials:
  - Username: `admin`
  - Password: `admin123` (change after first login)

## API Endpoints

The following endpoints are configured in API Gateway:

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Validate token
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Sales Invoices
- `GET /api/sales-invoices` - List all invoices
- `GET /api/sales-invoices/{id}` - Get invoice by ID
- `POST /api/sales-invoices` - Create invoice
- `PUT /api/sales-invoices/{id}` - Update invoice
- `DELETE /api/sales-invoices/{id}` - Delete invoice

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/quantity` - Get quantity metrics
- `GET /api/dashboard/summary` - Get summary

(Similar patterns for other modules)

## Monitoring and Logs

### CloudWatch Logs

Lambda execution logs are automatically sent to CloudWatch Logs:

```bash
aws logs tail /aws/lambda/dev-rmcbilling-auth --follow
```

### Metrics

Monitor Lambda performance:

```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=dev-rmcbilling-auth \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

## Troubleshooting

### Lambda Function Issues

1. **Check CloudWatch Logs**:
   ```bash
   aws logs tail /aws/lambda/<function-name> --follow
   ```

2. **Test Lambda Function**:
   ```bash
   aws lambda invoke \
     --function-name dev-rmcbilling-auth \
     --payload '{"body": "{\"username\":\"admin\",\"password\":\"admin123\"}"}' \
     response.json
   ```

### RDS Connection Issues

1. **Verify security group rules**:
   - Ensure Lambda security group can access RDS security group on port 3306

2. **Check VPC configuration**:
   - Lambda functions must be in the same VPC as RDS
   - Private subnets must have NAT Gateway for internet access (if needed)

3. **Test database connection**:
   - Use a bastion host or RDS Proxy to connect and verify

### API Gateway Issues

1. **Check API Gateway logs**:
   ```bash
   aws logs tail /aws/apigateway/<api-id> --follow
   ```

2. **Test endpoint**:
   ```bash
   curl -X POST https://<api-endpoint>/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

## Updating the Stack

To update the infrastructure:

```bash
aws cloudformation update-stack \
  --stack-name rmcbilling-backend-dev \
  --template-body file://cloudformation-template.yaml \
  --parameters file://parameters.json \
  --capabilities CAPABILITY_NAMED_IAM
```

## Cost Optimization

1. **RDS**: Use db.t3.micro for development (consider db.t3.small+ for production)
2. **Lambda**: Free tier includes 1M requests/month and 400,000 GB-seconds
3. **API Gateway**: Free tier includes 1M API calls/month
4. **Data Transfer**: Minimize cross-AZ data transfer

## Security Best Practices

1. **Secrets Management**: Use AWS Secrets Manager for sensitive data
2. **IAM Roles**: Follow principle of least privilege
3. **VPC**: Keep RDS in private subnets
4. **Encryption**: Enable encryption at rest for RDS
5. **SSL/TLS**: Use HTTPS for all API endpoints
6. **JWT**: Rotate JWT secret regularly
7. **Database**: Change default admin password immediately

## Cleanup

To delete the entire stack:

```bash
aws cloudformation delete-stack --stack-name rmcbilling-backend-dev
```

**Note**: This will delete all resources including the RDS database. Ensure you have backups before deletion.

## Support

For issues or questions:
1. Check CloudWatch Logs for errors
2. Review AWS CloudFormation events
3. Consult AWS Lambda documentation
4. Contact the development team

## Next Steps

1. Set up CI/CD pipeline for automated deployments
2. Implement comprehensive testing
3. Add monitoring and alerting
4. Set up database backups and disaster recovery
5. Configure custom domain for API Gateway
6. Implement rate limiting and throttling
7. Add API documentation (Swagger/OpenAPI)
