import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    sales: true,
    customerManagement: true,
    qualityControl: true,
    inventory: true,
    finance: true
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="main-layout">
      <header className="header">
        <div className="header-content">
          <h1>Readmix Concrete - Business Portal</h1>
        </div>
      </header>
      
      <div className="layout-container">
        <nav className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? '»' : '«'}
          </button>
          
          <ul className="nav-menu">
            <li>
              <Link to="/">
                <span className="nav-icon">🏠</span>
                {!isSidebarCollapsed && <span className="nav-text">Dashboard</span>}
              </Link>
            </li>
            
            <li className="nav-section-header">
              <button 
                className="section-toggle"
                onClick={() => toggleSection('sales')}
                aria-label={expandedSections.sales ? "Collapse Sales section" : "Expand Sales section"}
              >
                <span className="nav-icon">📊</span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="section-title">Sales</span>
                    <span className="expand-icon">{expandedSections.sales ? '▼' : '▶'}</span>
                  </>
                )}
              </button>
            </li>
            {expandedSections.sales && !isSidebarCollapsed && (
              <>
                <li>
                  <Link to="/sales-invoice">Sales Invoice</Link>
                </li>
                <li>
                  <Link to="/delivery-challan">Delivery Challan</Link>
                </li>
                <li>
                  <Link to="/weight-bridge">Weight Bridge Reports</Link>
                </li>
              </>
            )}
            
            <li className="nav-section-header">
              <button 
                className="section-toggle"
                onClick={() => toggleSection('customerManagement')}
                aria-label={expandedSections.customerManagement ? "Collapse Customer Management section" : "Expand Customer Management section"}
              >
                <span className="nav-icon">👥</span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="section-title">Customer Management</span>
                    <span className="expand-icon">{expandedSections.customerManagement ? '▼' : '▶'}</span>
                  </>
                )}
              </button>
            </li>
            {expandedSections.customerManagement && !isSidebarCollapsed && (
              <>
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
              </>
            )}
            
            <li className="nav-section-header">
              <button 
                className="section-toggle"
                onClick={() => toggleSection('qualityControl')}
                aria-label={expandedSections.qualityControl ? "Collapse Quality Control section" : "Expand Quality Control section"}
              >
                <span className="nav-icon">✓</span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="section-title">Quality Control</span>
                    <span className="expand-icon">{expandedSections.qualityControl ? '▼' : '▶'}</span>
                  </>
                )}
              </button>
            </li>
            {expandedSections.qualityControl && !isSidebarCollapsed && (
              <>
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
              </>
            )}
            
            <li className="nav-section-header">
              <button 
                className="section-toggle"
                onClick={() => toggleSection('inventory')}
                aria-label={expandedSections.inventory ? "Collapse Inventory section" : "Expand Inventory section"}
              >
                <span className="nav-icon">📦</span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="section-title">Inventory</span>
                    <span className="expand-icon">{expandedSections.inventory ? '▼' : '▶'}</span>
                  </>
                )}
              </button>
            </li>
            {expandedSections.inventory && !isSidebarCollapsed && (
              <>
                <li>
                  <Link to="/aggregates">Aggregates</Link>
                </li>
              </>
            )}
            
            <li className="nav-section-header">
              <button 
                className="section-toggle"
                onClick={() => toggleSection('finance')}
                aria-label={expandedSections.finance ? "Collapse Finance section" : "Expand Finance section"}
              >
                <span className="nav-icon">💰</span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="section-title">Finance</span>
                    <span className="expand-icon">{expandedSections.finance ? '▼' : '▶'}</span>
                  </>
                )}
              </button>
            </li>
            {expandedSections.finance && !isSidebarCollapsed && (
              <>
                <li>
                  <Link to="/cash-book">Cash Book</Link>
                </li>
              </>
            )}
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
