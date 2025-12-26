import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', gstNumber: '', status: 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Customer saved successfully');
    navigate('/customers');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{id ? 'Edit' : 'Add'} Customer</h1>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="form-input" />
          </div>
          <div className="form-group">
            <label>GST Number</label>
            <input type="text" name="gstNumber" value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value})} className="form-input" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="form-input">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Customer</button>
          <button type="button" onClick={() => navigate('/customers')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
