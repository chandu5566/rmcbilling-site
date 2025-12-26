import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../SalesInvoice/SalesInvoice.css';

const RecipeList = () => {
  const [recipes] = useState([
    { id: 1, name: 'Standard M25', mixDesign: 'M25', batchSize: 1.0, description: 'Standard recipe for M25 grade', status: 'Active' },
    { id: 2, name: 'Premium M30', mixDesign: 'M30', batchSize: 1.0, description: 'Premium recipe for M30 grade', status: 'Active' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Recipes</h1>
        <Link to="/qc/recipe/new" className="btn btn-primary">Add Recipe</Link>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mix Design</th>
              <th>Batch Size (m³)</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>{recipe.name}</td>
                <td>{recipe.mixDesign}</td>
                <td>{recipe.batchSize}</td>
                <td>{recipe.description}</td>
                <td><span className="status status-paid">{recipe.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/qc/recipe/edit/${recipe.id}`} className="btn btn-sm btn-secondary">Edit</Link>
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

export default RecipeList;
