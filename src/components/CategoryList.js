import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function CategoryList({ refresh }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data.categories);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch categories');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>Categories</h3>
      {categories.length === 0 ? (
        <p>No categories yet. Create your first category above!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '0.75rem' }}>{category.name}</td>
                <td style={{ padding: '0.75rem' }}>{category.description || '-'}</td>
                <td style={{ padding: '0.75rem' }}>
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CategoryList;