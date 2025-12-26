import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import SalesInvoiceList from './pages/SalesInvoice/SalesInvoiceList';
import SalesInvoiceForm from './pages/SalesInvoice/SalesInvoiceForm';
import DeliveryChallanList from './pages/DeliveryChallan/DeliveryChallanList';
import DeliveryChallanForm from './pages/DeliveryChallan/DeliveryChallanForm';
import WeightBridgeList from './pages/WeightBridge/WeightBridgeList';
import CustomerList from './pages/Customer/CustomerList';
import CustomerForm from './pages/Customer/CustomerForm';
import PurchaseOrderList from './pages/PurchaseOrder/PurchaseOrderList';
import SalesOrderList from './pages/SalesOrder/SalesOrderList';
import QuotationList from './pages/Quotation/QuotationList';
import MixDesignList from './pages/QC/MixDesign/MixDesignList';
import RecipeList from './pages/QC/Recipe/RecipeList';
import CubeTestList from './pages/QC/CubeTest/CubeTestList';
import BatchList from './pages/QC/BatchList/BatchList';
import AggregatesList from './pages/Aggregates/AggregatesList';
import CashBookList from './pages/CashBook/CashBookList';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* Sales Invoice Routes */}
          <Route path="sales-invoice" element={<SalesInvoiceList />} />
          <Route path="sales-invoice/new" element={<SalesInvoiceForm />} />
          <Route path="sales-invoice/edit/:id" element={<SalesInvoiceForm />} />
          
          {/* Delivery Challan Routes */}
          <Route path="delivery-challan" element={<DeliveryChallanList />} />
          <Route path="delivery-challan/new" element={<DeliveryChallanForm />} />
          <Route path="delivery-challan/edit/:id" element={<DeliveryChallanForm />} />
          
          {/* Weight Bridge Routes */}
          <Route path="weight-bridge" element={<WeightBridgeList />} />
          
          {/* Customer Routes */}
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/edit/:id" element={<CustomerForm />} />
          
          {/* Purchase Order Routes */}
          <Route path="purchase-order" element={<PurchaseOrderList />} />
          
          {/* Sales Order Routes */}
          <Route path="sales-order" element={<SalesOrderList />} />
          
          {/* Quotation Routes */}
          <Route path="quotation" element={<QuotationList />} />
          
          {/* QC Routes */}
          <Route path="qc/mix-design" element={<MixDesignList />} />
          <Route path="qc/recipe" element={<RecipeList />} />
          <Route path="qc/cube-test" element={<CubeTestList />} />
          <Route path="qc/batch-list" element={<BatchList />} />
          
          {/* Aggregates Routes */}
          <Route path="aggregates" element={<AggregatesList />} />
          
          {/* Cash Book Routes */}
          <Route path="cash-book" element={<CashBookList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
