import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const PurchaseOrderList = () => {
  const [orders] = useState([
    { id: 1, poNumber: 'PO-2024-001', customerName: 'ABC Construction', date: '2024-01-15', amount: 250000, status: 'Active' },
    { id: 2, poNumber: 'PO-2024-002', customerName: 'XYZ Builders', date: '2024-01-18', amount: 180000, status: 'Active' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Purchase Orders</h1>
        <Link to="/purchase-order/new" className="btn btn-primary">Create PO</Link>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.poNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.date}</td>
                <td>₹{order.amount.toLocaleString()}</td>
                <td><span className="status status-paid">{order.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/purchase-order/edit/${order.id}`} className="btn btn-sm btn-secondary">Edit</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
