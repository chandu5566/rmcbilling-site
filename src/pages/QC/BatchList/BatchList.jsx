import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../SalesInvoice/SalesInvoice.css';

const BatchList = () => {
  const [batches] = useState([
    { id: 1, batchNumber: 'B-2024-001', mixDesign: 'M25', quantity: 10, date: '2024-01-15', plantOperator: 'John Doe', status: 'Completed' },
    { id: 2, batchNumber: 'B-2024-002', mixDesign: 'M30', quantity: 15, date: '2024-01-16', plantOperator: 'Jane Smith', status: 'Completed' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Batch List</h1>
        <Link to="/qc/batch-list/new" className="btn btn-primary">Add Batch</Link>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Batch Number</th>
              <th>Mix Design</th>
              <th>Quantity (m³)</th>
              <th>Date</th>
              <th>Plant Operator</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.id}>
                <td>{batch.batchNumber}</td>
                <td>{batch.mixDesign}</td>
                <td>{batch.quantity}</td>
                <td>{batch.date}</td>
                <td>{batch.plantOperator}</td>
                <td><span className="status status-paid">{batch.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/qc/batch-list/edit/${batch.id}`} className="btn btn-sm btn-secondary">Edit</Link>
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

export default BatchList;
