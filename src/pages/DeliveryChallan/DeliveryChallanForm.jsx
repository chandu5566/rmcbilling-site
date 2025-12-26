import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const DeliveryChallanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    challanNumber: '',
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    vehicleNumber: '',
    driverName: '',
    quantity: '',
    destination: '',
    status: 'In Transit',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`Challan ${isEditMode ? 'updated' : 'created'} successfully`);
    navigate('/delivery-challan');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit' : 'Create'} Delivery Challan</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <div className="form-group">
            <label>Challan Number</label>
            <input type="text" name="challanNumber" value={formData.challanNumber} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Vehicle Number</label>
            <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Driver Name</label>
            <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Quantity (m³)</label>
            <input type="number" step="0.01" name="quantity" value={formData.quantity} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Destination</label>
            <input type="text" name="destination" value={formData.destination} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditMode ? 'Update' : 'Create'} Challan
          </button>
          <button type="button" onClick={() => navigate('/delivery-challan')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryChallanForm;
