import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../SalesInvoice/SalesInvoice.css';

const CubeTestList = () => {
  const [tests] = useState([
    { id: 1, testId: 'CT-001', batchNumber: 'B-2024-001', castDate: '2024-01-15', testDate: '2024-02-12', strength: 28.5, status: 'Pass' },
    { id: 2, testId: 'CT-002', batchNumber: 'B-2024-002', castDate: '2024-01-16', testDate: '2024-02-13', strength: 32.0, status: 'Pass' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Cube Tests</h1>
        <Link to="/qc/cube-test/new" className="btn btn-primary">Add Cube Test</Link>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Batch Number</th>
              <th>Cast Date</th>
              <th>Test Date</th>
              <th>Strength (MPa)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id}>
                <td>{test.testId}</td>
                <td>{test.batchNumber}</td>
                <td>{test.castDate}</td>
                <td>{test.testDate}</td>
                <td>{test.strength}</td>
                <td><span className="status status-paid">{test.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/qc/cube-test/edit/${test.id}`} className="btn btn-sm btn-secondary">Edit</Link>
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

export default CubeTestList;
