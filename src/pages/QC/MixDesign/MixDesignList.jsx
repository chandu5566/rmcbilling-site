import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../SalesInvoice/SalesInvoice.css';

const MixDesignList = () => {
  const [mixDesigns] = useState([
    { id: 1, code: 'M25', grade: 'M25', cement: 320, sand: 650, aggregate: 1200, water: 180, status: 'Active' },
    { id: 2, code: 'M30', grade: 'M30', cement: 350, sand: 600, aggregate: 1150, water: 170, status: 'Active' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mix Designs</h1>
        <Link to="/qc/mix-design/new" className="btn btn-primary">Add Mix Design</Link>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Grade</th>
              <th>Cement (kg/m³)</th>
              <th>Sand (kg/m³)</th>
              <th>Aggregate (kg/m³)</th>
              <th>Water (L/m³)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mixDesigns.map((design) => (
              <tr key={design.id}>
                <td>{design.code}</td>
                <td>{design.grade}</td>
                <td>{design.cement}</td>
                <td>{design.sand}</td>
                <td>{design.aggregate}</td>
                <td>{design.water}</td>
                <td><span className="status status-paid">{design.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/qc/mix-design/edit/${design.id}`} className="btn btn-sm btn-secondary">Edit</Link>
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

export default MixDesignList;
