import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../SalesInvoice/SalesInvoice.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'ABC Construction', email: 'abc@example.com', phone: '9876543210', address: 'Bangalore', status: 'Active' },
    { id: 2, name: 'XYZ Builders', email: 'xyz@example.com', phone: '9876543211', address: 'Mumbai', status: 'Active' },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Customers</h1>
        <Link to="/customers/new" className="btn btn-primary">Add Customer</Link>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td><span className="status status-paid">{customer.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/customers/edit/${customer.id}`} className="btn btn-sm btn-secondary">Edit</Link>
                    <button onClick={() => handleDelete(customer.id)} className="btn btn-sm btn-danger">Delete</button>
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

export default CustomerList;
