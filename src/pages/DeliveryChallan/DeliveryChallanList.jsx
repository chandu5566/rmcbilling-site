import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const DeliveryChallanList = () => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChallans = async () => {
    try {
      const mockData = [
        {
          id: 1,
          challanNumber: 'DC-2024-001',
          customerName: 'ABC Construction',
          date: '2024-01-15',
          vehicleNumber: 'KA-01-AB-1234',
          quantity: 10,
          status: 'Delivered',
        },
        {
          id: 2,
          challanNumber: 'DC-2024-002',
          customerName: 'XYZ Builders',
          date: '2024-01-18',
          vehicleNumber: 'KA-02-CD-5678',
          quantity: 15,
          status: 'In Transit',
        },
      ];
      setChallans(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching challans:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this challan?')) {
      setChallans(challans.filter((c) => c.id !== id));
      alert('Challan deleted successfully');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Delivery Challans</h1>
        <Link to="/delivery-challan/new" className="btn btn-primary">
          Create New Challan
        </Link>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Challan Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Vehicle Number</th>
              <th>Quantity (m³)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {challans.map((challan) => (
              <tr key={challan.id}>
                <td>{challan.challanNumber}</td>
                <td>{challan.customerName}</td>
                <td>{challan.date}</td>
                <td>{challan.vehicleNumber}</td>
                <td>{challan.quantity}</td>
                <td>
                  <span className={`status status-${challan.status.toLowerCase().replace(' ', '-')}`}>
                    {challan.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/delivery-challan/edit/${challan.id}`} className="btn btn-sm btn-secondary">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(challan.id)} className="btn btn-sm btn-danger">
                      Delete
                    </button>
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

export default DeliveryChallanList;
