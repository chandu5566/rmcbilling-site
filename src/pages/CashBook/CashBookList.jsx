import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const CashBookList = () => {
  const [entries] = useState([
    { id: 1, date: '2024-01-15', description: 'Customer Payment - ABC Construction', type: 'Credit', amount: 125000, balance: 125000 },
    { id: 2, date: '2024-01-16', description: 'Cement Purchase', type: 'Debit', amount: 50000, balance: 75000 },
    { id: 3, date: '2024-01-17', description: 'Customer Payment - XYZ Builders', type: 'Credit', amount: 85000, balance: 160000 },
  ]);

  const totalCredit = entries.filter(e => e.type === 'Credit').reduce((sum, e) => sum + e.amount, 0);
  const totalDebit = entries.filter(e => e.type === 'Debit').reduce((sum, e) => sum + e.amount, 0);
  const balance = totalCredit - totalDebit;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Cash Book</h1>
        <Link to="/cash-book/new" className="btn btn-primary">Add Entry</Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-value">₹{totalCredit.toLocaleString()}</div>
          <div className="stat-label">Total Credit</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{totalDebit.toLocaleString()}</div>
          <div className="stat-label">Total Debit</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{balance.toLocaleString()}</div>
          <div className="stat-label">Balance</div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td>{entry.description}</td>
                <td><span className={`status status-${entry.type === 'Credit' ? 'paid' : 'pending'}`}>{entry.type}</span></td>
                <td>₹{entry.amount.toLocaleString()}</td>
                <td>₹{entry.balance.toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/cash-book/edit/${entry.id}`} className="btn btn-sm btn-secondary">Edit</Link>
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

export default CashBookList;
