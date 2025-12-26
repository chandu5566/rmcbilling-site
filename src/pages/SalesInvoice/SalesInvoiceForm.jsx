import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_CONFIG } from '../../services/apiService';
import './SalesInvoice.css';

const SalesInvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantity: '', rate: '', amount: 0 }],
    discount: 0,
    tax: 18,
    status: 'Pending',
  });

  const [loading, setLoading] = useState(false);

  const fetchInvoice = async () => {
    try {
      // Mock data for edit mode
      const mockData = {
        invoiceNumber: 'INV-2024-001',
        customerName: 'ABC Construction',
        date: '2024-01-15',
        items: [
          { description: 'M25 Concrete', quantity: 50, rate: 2500, amount: 125000 },
        ],
        discount: 0,
        tax: 18,
        status: 'Paid',
      };
      setFormData(mockData);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchInvoice();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Calculate amount
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = 
        (parseFloat(newItems[index].quantity) || 0) * 
        (parseFloat(newItems[index].rate) || 0);
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: '', rate: '', amount: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const discountAmount = (subtotal * (parseFloat(formData.discount) || 0)) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * (parseFloat(formData.tax) || 0)) / 100;
    const total = taxableAmount + taxAmount;
    
    return {
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      total,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        // await apiService.put(`${API_CONFIG.ENDPOINTS.SALES_INVOICE.UPDATE}/${id}`, formData);
        alert('Invoice updated successfully');
      } else {
        // await apiService.post(API_CONFIG.ENDPOINTS.SALES_INVOICE.CREATE, formData);
        alert('Invoice created successfully');
      }
      navigate('/sales-invoice');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotal();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit' : 'Create'} Sales Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <div className="form-group">
            <label>Invoice Number</label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="items-section">
          <h3>Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-grid">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="text"
                    value={item.amount.toFixed(2)}
                    readOnly
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>&nbsp;</label>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addItem} className="btn btn-secondary">
            Add Item
          </button>
        </div>

        <div className="totals-section">
          <div className="totals-grid">
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                step="0.01"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Tax (%)</label>
              <input
                type="number"
                step="0.01"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="totals-summary">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Discount:</span>
              <span>₹{totals.discountAmount.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Taxable Amount:</span>
              <span>₹{totals.taxableAmount.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax:</span>
              <span>₹{totals.taxAmount.toFixed(2)}</span>
            </div>
            <div className="total-row total-final">
              <span>Total:</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : isEditMode ? 'Update Invoice' : 'Create Invoice'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/sales-invoice')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesInvoiceForm;
