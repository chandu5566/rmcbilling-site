#!/bin/bash

# Lambda Deployment Script for RMC Billing Site
# This script packages and deploys all Lambda functions

set -euo pipefail

# Configuration
ENVIRONMENT=${1:-dev}
AWS_REGION=${2:-us-east-1}
STACK_NAME="${ENVIRONMENT}-rmcbilling-backend"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== RMC Billing Lambda Deployment Script ===${NC}"
echo "Environment: $ENVIRONMENT"
echo "Region: $AWS_REGION"
echo "Stack Name: $STACK_NAME"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

# Navigate to lambdas directory
cd "$(dirname "$0")/lambdas"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Lambda dependencies...${NC}"
    npm install
    echo -e "${GREEN}Dependencies installed${NC}"
fi

# Create build directory
BUILD_DIR="../lambda-builds"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

echo -e "${YELLOW}Packaging Lambda functions...${NC}"

# List of Lambda modules
MODULES=(
    "auth"
    "customers"
    "sales-invoices"
    "delivery-challans"
    "weight-bridge"
    "purchase-orders"
    "sales-orders"
    "quotations"
    "mix-designs"
    "recipes"
    "cube-tests"
    "batch-lists"
    "aggregates"
    "cash-book"
    "dashboard"
    "reports"
)

# Package each Lambda function
for module in "${MODULES[@]}"; do
    echo "Packaging $module..."
    
    # Create temporary directory for this module
    TEMP_DIR="$BUILD_DIR/$module"
    mkdir -p "$TEMP_DIR"
    
    # Copy module files
    cp -r "$module"/* "$TEMP_DIR/"
    
    # Copy utils folder
    cp -r utils "$TEMP_DIR/"
    
    # Copy node_modules
    cp -r node_modules "$TEMP_DIR/"
    
    # Create zip file
    cd "$TEMP_DIR"
    zip -qr "../${module}.zip" . > /dev/null
    cd - > /dev/null
    
    # Clean up temp directory
    rm -rf "$TEMP_DIR"
    
    echo -e "${GREEN}✓ $module packaged${NC}"
done

echo ""
echo -e "${GREEN}All Lambda functions packaged successfully!${NC}"
echo "Package files are in: $BUILD_DIR"
echo ""

# Ask if user wants to deploy
read -p "Do you want to update Lambda functions in AWS? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Updating Lambda functions...${NC}"
    
    for module in "${MODULES[@]}"; do
        FUNCTION_NAME="${ENVIRONMENT}-rmcbilling-${module}"
        ZIP_FILE="$BUILD_DIR/${module}.zip"
        
        echo "Updating $FUNCTION_NAME..."
        
        if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$AWS_REGION" &> /dev/null; then
            aws lambda update-function-code \
                --function-name "$FUNCTION_NAME" \
                --zip-file "fileb://$ZIP_FILE" \
                --region "$AWS_REGION" \
                --no-cli-pager > /dev/null
            echo -e "${GREEN}✓ $FUNCTION_NAME updated${NC}"
        else
            echo -e "${YELLOW}⚠ $FUNCTION_NAME not found, skipping${NC}"
        fi
    done
    
    echo ""
    echo -e "${GREEN}All Lambda functions updated successfully!${NC}"
else
    echo "Deployment skipped. Package files are ready in: $BUILD_DIR"
fi

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
