import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const AggregatesList = () => {
  const [aggregates] = useState([
    { id: 1, name: 'River Sand', vendor: 'ABC Suppliers', quantity: 500, unit: 'Tons', rate: 800, paymentStatus: 'Paid' },
    { id: 2, name: '20mm Aggregate', vendor: 'XYZ Materials', quantity: 300, unit: 'Tons', rate: 950, paymentStatus: 'Pending' },
    { id: 3, name: '10mm Aggregate', vendor: 'DEF Traders', quantity: 200, unit: 'Tons', rate: 900, paymentStatus: 'Pending' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Aggregates</h1>
        <div>
          <Link to="/aggregates/payment-pending" className="btn btn-secondary" style={{ marginRight: '10px' }}>
            Payment Pending
          </Link>
          <Link to="/aggregates/new" className="btn btn-primary">Add Aggregate</Link>
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Vendor</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Rate (₹)</th>
              <th>Total (₹)</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {aggregates.map((agg) => (
              <tr key={agg.id}>
                <td>{agg.name}</td>
                <td>{agg.vendor}</td>
                <td>{agg.quantity}</td>
                <td>{agg.unit}</td>
                <td>₹{agg.rate}</td>
                <td>₹{(agg.quantity * agg.rate).toLocaleString()}</td>
                <td>
                  <span className={`status status-${agg.paymentStatus === 'Paid' ? 'paid' : 'pending'}`}>
                    {agg.paymentStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/aggregates/edit/${agg.id}`} className="btn btn-sm btn-secondary">Edit</Link>
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

export default AggregatesList;
