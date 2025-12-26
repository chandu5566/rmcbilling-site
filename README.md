# RMC Billing Site - Readmix Concrete Business Portal

A comprehensive React-based web application for managing all aspects of a Ready-Mix Concrete (RMC) business. This unified portal handles sales, customer management, quality control, inventory, and financial operations.

## Features

### 1. Sales Management
- **Sales Invoice**: Complete CRUD operations for sales invoices with item-wise billing, tax, and discount calculations
- **Delivery Challan**: Create and manage delivery challans for concrete deliveries
- **Weight Bridge Reports**: Track and manage weight bridge measurements

### 2. Customer Management
- **Customer CRUD**: Add, edit, view, and manage customer information
- **Purchase Orders**: Generate and manage customer purchase orders
- **Sales Orders**: Create sales orders with scheduling capabilities
- **Quotations**: Generate and manage quotations with PDF export capability

### 3. Quality Control (QC)
- **Mix Design**: Manage concrete mix designs with ingredient specifications
- **Recipes**: Create and manage production recipes
- **Cube Test**: Track concrete strength testing and cube test results
- **Batch List**: Monitor production batches and plant operations

### 4. Inventory Management
- **Aggregates**: Manage aggregate inventory
- **Vendor Management**: List aggregates by vendor
- **Payment Tracking**: Track pending payments for materials

### 5. Financial Management
- **Cash Book**: Maintain cash book entries with credit/debit tracking
- **Payment Management**: Monitor payment status across modules

### 6. Dashboard
- Comprehensive dashboard showing:
  - Key business metrics
  - Quantity tracking (daily, weekly, monthly)
  - Quick access to common operations
  - Summary statistics

## Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios
- **Styling**: CSS3 with custom components

## Project Structure

```
src/
├── config/
│   └── api.js                 # Centralized API configuration
├── services/
│   └── apiService.js          # API service with Axios interceptors
├── layouts/
│   ├── MainLayout.jsx         # Main application layout
│   └── MainLayout.css
├── pages/
│   ├── Dashboard/             # Dashboard module
│   ├── SalesInvoice/          # Sales Invoice CRUD
│   ├── DeliveryChallan/       # Delivery Challan module
│   ├── WeightBridge/          # Weight Bridge Reports
│   ├── Customer/              # Customer management
│   ├── PurchaseOrder/         # Purchase Order management
│   ├── SalesOrder/            # Sales Order management
│   ├── Quotation/             # Quotation management
│   ├── QC/                    # Quality Control modules
│   │   ├── MixDesign/
│   │   ├── Recipe/
│   │   ├── CubeTest/
│   │   └── BatchList/
│   ├── Aggregates/            # Aggregates management
│   └── CashBook/              # Cash Book entries
├── components/                # Reusable components
└── App.jsx                    # Main application with routes

```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chandu5566/rmcbilling-site.git
   cd rmcbilling-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update `VITE_API_BASE_URL` with your backend API URL.

## API Configuration

All API endpoints are centralized in `src/config/api.js`. To update API details:

1. Open `src/config/api.js`
2. Update the `BASE_URL` or individual endpoint paths as needed
3. All modules will automatically use the updated configuration

### API Configuration Structure

```javascript
const API_CONFIG = {
  BASE_URL: 'http://your-api-url/api',
  ENDPOINTS: {
    SALES_INVOICE: { LIST, CREATE, UPDATE, DELETE, GET_BY_ID },
    DELIVERY_CHALLAN: { ... },
    CUSTOMER: { ... },
    // ... other endpoints
  },
  TIMEOUT: 30000,
  HEADERS: { 'Content-Type': 'application/json' }
};
```

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Module Overview

### Sales Invoice Module
- Create invoices with multiple line items
- Automatic tax and discount calculations
- Edit and delete existing invoices
- Search and filter capabilities

### Customer Management
- Complete customer database
- Contact information management
- GST number tracking
- Customer status management

### Quality Control
- **Mix Design**: Define concrete grades with material proportions
- **Recipe**: Production recipes for different mix designs
- **Cube Test**: Track 7-day and 28-day strength tests
- **Batch List**: Production batch tracking

### Aggregates Management
- Track aggregate inventory by type
- Vendor-wise listing
- Payment pending reports
- Quantity and rate management

### Cash Book
- Credit and debit entry management
- Running balance calculation
- Transaction categorization
- Financial summary reports

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary to Readmix Concrete.

## Support

For support, please contact the development team or raise an issue in the repository.

## Future Enhancements

- User authentication and authorization
- Role-based access control
- Advanced reporting and analytics
- Mobile responsive design improvements
- PDF generation for invoices and reports
- Email notifications
- Real-time updates with WebSocket
- Backup and data export features
