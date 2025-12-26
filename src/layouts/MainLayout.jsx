import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import './MainLayout.css';
import speedLogo from '../icons/speed_logo.png';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    sales: false,
    customerManagement: false,
    qualityControl: false,
    inventory: false,
    finance: false,
    reports: false
  });
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Logout anyway even if API call fails
      logout();
      navigate('/login');
    }
  };


  return (
    <div className="main-layout">
      <header className="header">
        <div className="header-content">
          <img src={speedLogo} alt="Speed Billing Logo" className="header-logo" />
          <h1>Speed Billing Portal</h1>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{user?.name || user?.username}</span>
              {user?.role && <span className="user-role">({user.role})</span>}
            </div>
            <button onClick={handleLogout} className="logout-button">
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
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
            
            <li className="nav-section-header">
              <button 
                className="section-toggle"
                onClick={() => toggleSection('reports')}
                aria-label={expandedSections.reports ? "Collapse Reports section" : "Expand Reports section"}
              >
                <span className="nav-icon">📊</span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="section-title">Reports</span>
                    <span className="expand-icon">{expandedSections.reports ? '▼' : '▶'}</span>
                  </>
                )}
              </button>
            </li>
            {expandedSections.reports && !isSidebarCollapsed && (
              <>
                <li>
                  <Link to="/reports">Download Reports</Link>
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
