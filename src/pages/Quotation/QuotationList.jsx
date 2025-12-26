import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const QuotationList = () => {
  const [quotations] = useState([
    { id: 1, quotationNumber: 'QT-2024-001', customerName: 'ABC Construction', date: '2024-01-10', amount: 250000, validUntil: '2024-02-10', status: 'Sent' },
    { id: 2, quotationNumber: 'QT-2024-002', customerName: 'XYZ Builders', date: '2024-01-12', amount: 180000, validUntil: '2024-02-12', status: 'Accepted' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quotations</h1>
        <Link to="/quotation/new" className="btn btn-primary">Create Quotation</Link>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Quotation Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Valid Until</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quot) => (
              <tr key={quot.id}>
                <td>{quot.quotationNumber}</td>
                <td>{quot.customerName}</td>
                <td>{quot.date}</td>
                <td>₹{quot.amount.toLocaleString()}</td>
                <td>{quot.validUntil}</td>
                <td><span className="status status-paid">{quot.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/quotation/edit/${quot.id}`} className="btn btn-sm btn-secondary">Edit</Link>
                    <button className="btn btn-sm btn-primary">Generate PDF</button>
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

export default QuotationList;
