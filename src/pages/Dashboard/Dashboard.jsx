import { useEffect, useState } from 'react';
import { API_CONFIG } from '../../services/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalCustomers: 0,
    totalOrders: 0,
    quantity: {
      today: 0,
      week: 0,
      month: 0,
    },
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // In a real application, this would fetch from the API
      // For now, using mock data
      setStats({
        totalInvoices: 45,
        totalCustomers: 32,
        totalOrders: 28,
        quantity: {
          today: 125.5,
          week: 850.0,
          month: 3420.0,
        },
        pendingPayments: 15,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalInvoices}</div>
          <div className="stat-label">Total Invoices</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.totalCustomers}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">Active Orders</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.pendingPayments}</div>
          <div className="stat-label">Pending Payments</div>
        </div>
      </div>
      
      <div className="quantity-section">
        <h2>Concrete Quantity (Cubic Meters)</h2>
        <div className="quantity-cards">
          <div className="quantity-card">
            <div className="quantity-value">{stats.quantity.today}</div>
            <div className="quantity-label">Today</div>
          </div>
          
          <div className="quantity-card">
            <div className="quantity-value">{stats.quantity.week}</div>
            <div className="quantity-label">This Week</div>
          </div>
          
          <div className="quantity-card">
            <div className="quantity-value">{stats.quantity.month}</div>
            <div className="quantity-label">This Month</div>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h2>Quick Access</h2>
        <div className="quick-links">
          <a href="/sales-invoice/new" className="quick-link-card">
            <h3>New Invoice</h3>
            <p>Create a new sales invoice</p>
          </a>
          
          <a href="/sales-order/new" className="quick-link-card">
            <h3>New Order</h3>
            <p>Create a new sales order</p>
          </a>
          
          <a href="/delivery-challan/new" className="quick-link-card">
            <h3>Delivery Challan</h3>
            <p>Create delivery challan</p>
          </a>
          
          <a href="/aggregates/payment-pending" className="quick-link-card">
            <h3>Pending Payments</h3>
            <p>View payment pending</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
