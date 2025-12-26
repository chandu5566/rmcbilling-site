import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_CONFIG } from '../../services/apiService';
import './SalesInvoice.css';

const SalesInvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInvoices = async () => {
    try {
      // Mock data for demonstration
      const mockData = [
        {
          id: 1,
          invoiceNumber: 'INV-2024-001',
          customerName: 'ABC Construction',
          date: '2024-01-15',
          amount: 125000,
          status: 'Paid',
        },
        {
          id: 2,
          invoiceNumber: 'INV-2024-002',
          customerName: 'XYZ Builders',
          date: '2024-01-18',
          amount: 85000,
          status: 'Pending',
        },
        {
          id: 3,
          invoiceNumber: 'INV-2024-003',
          customerName: 'DEF Infrastructure',
          date: '2024-01-20',
          amount: 150000,
          status: 'Paid',
        },
      ];
      setInvoices(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        // await apiService.delete(`${API_CONFIG.ENDPOINTS.SALES_INVOICE.DELETE}/${id}`);
        setInvoices(invoices.filter((inv) => inv.id !== id));
        alert('Invoice deleted successfully');
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice');
      }
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading invoices...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Sales Invoices</h1>
        <Link to="/sales-invoice/new" className="btn btn-primary">
          Create New Invoice
        </Link>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by invoice number or customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.customerName}</td>
                <td>{invoice.date}</td>
                <td>₹{invoice.amount.toLocaleString()}</td>
                <td>
                  <span className={`status status-${invoice.status.toLowerCase()}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      to={`/sales-invoice/edit/${invoice.id}`}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="no-data">No invoices found</div>
      )}
    </div>
  );
};

export default SalesInvoiceList;
