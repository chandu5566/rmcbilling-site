# Backend Infrastructure - Quick Start Guide

This document provides a quick overview of the backend infrastructure setup for the RMC Billing Site.

## 📁 What's Been Created

### 1. Lambda Functions (`/lambdas/`)
A complete serverless backend with 16 Lambda function modules covering all business operations:

**Core Modules:**
- `auth/` - Authentication (login, validate, refresh, logout)
- `customers/` - Customer management
- `sales-invoices/` - Sales invoice management with line items
- `delivery-challans/` - Delivery challan tracking
- `weight-bridge/` - Weight bridge reports

**Order Management:**
- `purchase-orders/` - Purchase order management
- `sales-orders/` - Sales order management
- `quotations/` - Quotation management

**Quality Control (QC):**
- `mix-designs/` - Concrete mix design management
- `recipes/` - Production recipe management
- `cube-tests/` - Concrete strength testing
- `batch-lists/` - Production batch tracking

**Financial & Inventory:**
- `aggregates/` - Aggregate inventory management
- `cash-book/` - Cash book entries and financial tracking
- `dashboard/` - Business metrics and statistics
- `reports/` - Report generation

**Shared Utilities (`/lambdas/utils/`):**
- `db.js` - MySQL database connection with pooling
- `auth.js` - JWT token generation and validation
- `response.js` - Standardized API responses
- `errorHandler.js` - Centralized error handling
- `crudHandler.js` - Generic CRUD operations template

### 2. CloudFormation Template (`cloudformation-template.yaml`)
Complete AWS infrastructure as code:
- **VPC Setup**: Public and private subnets across 2 availability zones
- **RDS MySQL 8.0**: Managed database in private subnets
- **16 Lambda Functions**: With VPC configuration and IAM roles
- **API Gateway HTTP API**: RESTful API with CORS support
- **Security Groups**: Network isolation between Lambda and RDS
- **Environment Variables**: Automatic configuration for all Lambda functions

### 3. Database Schema (`database-schema.sql`)
Complete MySQL schema with 15 tables:
- Users (authentication)
- Customers
- Sales Invoices + Items
- Delivery Challans
- Weight Bridge Reports
- Purchase/Sales Orders
- Quotations
- QC Tables (Mix Designs, Recipes, Cube Tests, Batch Lists)
- Aggregates
- Cash Book

**Includes:**
- Proper indexes for performance
- Foreign key relationships
- Audit fields (created_by, updated_by, timestamps)
- Default admin user (username: `admin`, password: `admin123`)

### 4. Deployment Tools

**`deploy-lambdas.sh`** - Automated deployment script:
- Installs dependencies
- Packages all Lambda functions
- Creates deployment zip files
- Optionally deploys to AWS

**`DEPLOYMENT.md`** - Complete deployment guide:
- Prerequisites and setup
- Step-by-step deployment instructions
- Configuration details
- Monitoring and troubleshooting
- Security best practices

**`LAMBDA_REFERENCE.md`** - Technical reference:
- Detailed API for each Lambda function
- Utility function documentation
- Common patterns and examples
- Best practices for extending the backend

## 🚀 Quick Start

### Option 1: Manual Deployment

1. **Install dependencies:**
   ```bash
   cd lambdas
   npm install
   ```

2. **Create parameters file:**
   ```bash
   cat > parameters.json << EOF
   [
     {"ParameterKey": "Environment", "ParameterValue": "dev"},
     {"ParameterKey": "DBUsername", "ParameterValue": "admin"},
     {"ParameterKey": "DBPassword", "ParameterValue": "YourSecurePassword123!"},
     {"ParameterKey": "DBName", "ParameterValue": "rmcbilling"},
     {"ParameterKey": "JWTSecret", "ParameterValue": "your-32-character-jwt-secret-key"}
   ]
   EOF
   ```

3. **Deploy CloudFormation stack:**
   ```bash
   aws cloudformation create-stack \
     --stack-name rmcbilling-backend-dev \
     --template-body file://cloudformation-template.yaml \
     --parameters file://parameters.json \
     --capabilities CAPABILITY_NAMED_IAM \
     --region us-east-1
   ```

4. **Wait for stack creation (~10-15 minutes):**
   ```bash
   aws cloudformation wait stack-create-complete \
     --stack-name rmcbilling-backend-dev
   ```

5. **Deploy Lambda code:**
   ```bash
   ./deploy-lambdas.sh dev us-east-1
   ```

6. **Initialize database:**
   ```bash
   # Get RDS endpoint
   RDS_ENDPOINT=$(aws cloudformation describe-stacks \
     --stack-name rmcbilling-backend-dev \
     --query 'Stacks[0].Outputs[?OutputKey==`RDSEndpoint`].OutputValue' \
     --output text)
   
   # Load schema
   mysql -h $RDS_ENDPOINT -u admin -p rmcbilling < database-schema.sql
   ```

7. **Get API endpoint:**
   ```bash
   aws cloudformation describe-stacks \
     --stack-name rmcbilling-backend-dev \
     --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
     --output text
   ```

### Option 2: Using Deployment Script

```bash
# Package all Lambda functions
./deploy-lambdas.sh dev us-east-1

# Answer 'y' when prompted to deploy
```

## 🔌 API Endpoints

Once deployed, your API will be available at:
```
https://<api-id>.execute-api.<region>.amazonaws.com/dev/api
```

### Available Endpoints:

**Authentication:**
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Validate token
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

**Resources (CRUD pattern):**
- `/api/customers`
- `/api/sales-invoices`
- `/api/delivery-challans`
- `/api/weight-bridge-reports`
- `/api/purchase-orders`
- `/api/sales-orders`
- `/api/quotations`
- `/api/mix-designs`
- `/api/recipes`
- `/api/cube-tests`
- `/api/batch-lists`
- `/api/aggregates`
- `/api/cash-book`

**Dashboard:**
- `GET /api/dashboard/stats` - Business statistics
- `GET /api/dashboard/quantity` - Quantity metrics
- `GET /api/dashboard/summary` - Activity summary

**Reports:**
- `GET /api/reports` - Available reports
- `GET /api/reports/preview` - Preview report
- `GET /api/reports/download` - Download report

## 🔐 Default Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123`
- ⚠️ **Change this immediately after first login!**

## 🛠️ Update Frontend Configuration

Update your frontend `.env` file:
```env
VITE_API_BASE_URL=https://<your-api-id>.execute-api.us-east-1.amazonaws.com/dev/api
```

## 📊 Architecture Overview

```
┌─────────────┐
│   Frontend  │ (React + Vite)
│   (S3/CDN)  │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────┐
│ API Gateway │ (HTTP API)
│   + CORS    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│      Lambda Functions           │
│  (16 functions, Node.js 18.x)   │
│     - Authentication            │
│     - Business Logic            │
│     - Data Validation           │
└──────┬──────────────────────────┘
       │ VPC
       ▼
┌─────────────┐
│  RDS MySQL  │ (Private Subnet)
│   8.0.35    │ 
└─────────────┘
```

## 💰 Estimated Costs

**Development Environment (Low Traffic):**
- RDS db.t3.micro: ~$15/month
- Lambda (within free tier): ~$0/month
- API Gateway (within free tier): ~$0/month
- Data Transfer: ~$1-2/month
- **Total: ~$16-17/month**

**Production Environment:**
- Scale up RDS instance as needed
- Lambda charges based on usage
- Consider Reserved Instances for cost savings

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[LAMBDA_REFERENCE.md](./LAMBDA_REFERENCE.md)** - Technical reference
- **[README.md](./README.md)** - Frontend application guide
- **[database-schema.sql](./database-schema.sql)** - Database structure

## 🔍 Testing the Deployment

Test authentication endpoint:
```bash
curl -X POST https://<api-endpoint>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@rmcbilling.com",
      "fullName": "System Administrator",
      "role": "admin"
    }
  }
}
```

## 🐛 Troubleshooting

**CloudFormation Stack Creation Failed:**
- Check AWS CloudFormation console for error details
- Verify you have sufficient IAM permissions
- Ensure you're in the correct AWS region

**Lambda Functions Not Working:**
- Check CloudWatch Logs: `/aws/lambda/<function-name>`
- Verify environment variables are set correctly
- Ensure Lambda is in the correct VPC subnets

**Database Connection Errors:**
- Verify security group allows Lambda → RDS communication
- Check RDS endpoint and credentials
- Ensure Lambda is in private subnets

**API Gateway 403 Errors:**
- Verify Lambda permissions for API Gateway invoke
- Check CORS configuration
- Ensure Authorization header is properly formatted

## 📞 Support

For issues:
1. Check CloudWatch Logs
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
3. Verify CloudFormation stack outputs
4. Contact the development team

## 🎯 Next Steps

1. ✅ Deploy the infrastructure
2. ✅ Test API endpoints
3. ✅ Update frontend configuration
4. 🔲 Change default admin password
5. 🔲 Set up CI/CD pipeline
6. 🔲 Configure custom domain
7. 🔲 Enable monitoring and alerts
8. 🔲 Set up automated backups
9. 🔲 Implement rate limiting
10. 🔲 Add API documentation (Swagger)

## ⚠️ Important Notes

- **Secrets**: Never commit `parameters.json` to version control
- **Security**: Change default admin password immediately
- **Backups**: RDS automated backups are enabled (7 days retention)
- **Costs**: Monitor AWS billing dashboard regularly
- **Updates**: Use `aws cloudformation update-stack` for infrastructure changes
- **Deletion**: Use `aws cloudformation delete-stack` to remove all resources

## 🎉 Success!

You now have a fully functional serverless backend for the RMC Billing Site!

The infrastructure includes:
- ✅ 16 Lambda functions
- ✅ API Gateway with 30+ routes
- ✅ MySQL database with complete schema
- ✅ VPC with proper network isolation
- ✅ Security groups and IAM roles
- ✅ Automated deployment scripts
- ✅ Comprehensive documentation

Happy coding! 🚀
