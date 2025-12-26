import { Link, Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <header className="header">
        <div className="header-content">
          <h1>Readmix Concrete - Business Portal</h1>
        </div>
      </header>
      
      <div className="layout-container">
        <nav className="sidebar">
          <ul className="nav-menu">
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            
            <li className="nav-section">Sales</li>
            <li>
              <Link to="/sales-invoice">Sales Invoice</Link>
            </li>
            <li>
              <Link to="/delivery-challan">Delivery Challan</Link>
            </li>
            <li>
              <Link to="/weight-bridge">Weight Bridge Reports</Link>
            </li>
            
            <li className="nav-section">Customer Management</li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
            <li>
              <Link to="/purchase-order">Purchase Orders</Link>
            </li>
            <li>
              <Link to="/sales-order">Sales Orders</Link>
            </li>
            <li>
              <Link to="/quotation">Quotations</Link>
            </li>
            
            <li className="nav-section">Quality Control</li>
            <li>
              <Link to="/qc/mix-design">Mix Design</Link>
            </li>
            <li>
              <Link to="/qc/recipe">Recipes</Link>
            </li>
            <li>
              <Link to="/qc/cube-test">Cube Test</Link>
            </li>
            <li>
              <Link to="/qc/batch-list">Batch List</Link>
            </li>
            
            <li className="nav-section">Inventory</li>
            <li>
              <Link to="/aggregates">Aggregates</Link>
            </li>
            
            <li className="nav-section">Finance</li>
            <li>
              <Link to="/cash-book">Cash Book</Link>
            </li>
          </ul>
        </nav>
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
