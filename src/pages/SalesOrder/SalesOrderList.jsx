import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const SalesOrderList = () => {
  const [orders] = useState([
    { id: 1, orderNumber: 'SO-2024-001', customerName: 'ABC Construction', date: '2024-01-15', quantity: 50, mixDesign: 'M25', scheduledDate: '2024-01-20', status: 'Scheduled' },
    { id: 2, orderNumber: 'SO-2024-002', customerName: 'XYZ Builders', date: '2024-01-18', quantity: 35, mixDesign: 'M30', scheduledDate: '2024-01-22', status: 'Pending' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Sales Orders</h1>
        <Link to="/sales-order/new" className="btn btn-primary">Create Order</Link>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Quantity (m³)</th>
              <th>Mix Design</th>
              <th>Scheduled Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.date}</td>
                <td>{order.quantity}</td>
                <td>{order.mixDesign}</td>
                <td>{order.scheduledDate}</td>
                <td><span className="status status-paid">{order.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/sales-order/edit/${order.id}`} className="btn btn-sm btn-secondary">Edit</Link>
                    <Link to={`/sales-order/schedule/${order.id}`} className="btn btn-sm btn-primary">Schedule</Link>
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

export default SalesOrderList;
