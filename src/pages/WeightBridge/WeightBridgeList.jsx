import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const WeightBridgeList = () => {
  const [reports] = useState([
    { id: 1, ticketNumber: 'WB-001', vehicleNumber: 'KA-01-AB-1234', date: '2024-01-15', grossWeight: 25000, tareWeight: 15000, netWeight: 10000 },
    { id: 2, ticketNumber: 'WB-002', vehicleNumber: 'KA-02-CD-5678', date: '2024-01-16', grossWeight: 28000, tareWeight: 15500, netWeight: 12500 },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Weight Bridge Reports</h1>
        <Link to="/weight-bridge/new" className="btn btn-primary">Add Report</Link>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Vehicle Number</th>
              <th>Date</th>
              <th>Gross Weight (kg)</th>
              <th>Tare Weight (kg)</th>
              <th>Net Weight (kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.ticketNumber}</td>
                <td>{report.vehicleNumber}</td>
                <td>{report.date}</td>
                <td>{report.grossWeight.toLocaleString()}</td>
                <td>{report.tareWeight.toLocaleString()}</td>
                <td>{report.netWeight.toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/weight-bridge/edit/${report.id}`} className="btn btn-sm btn-secondary">Edit</Link>
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

export default WeightBridgeList;
