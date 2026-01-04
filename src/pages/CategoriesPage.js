import React, { useState } from 'react';
import CategoryForm from '../components/CategoryForm';
import { apiService } from '../services/api';

function CategoriesPage() {
  const [refresh, setRefresh] = useState(0);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [updateError, setUpdateError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleCategoryCreated = () => {
    setRefresh(prev => prev + 1);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      description: category.description || ''
    });
    setUpdateError('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditFormData({ name: '', description: '' });
    setUpdateError('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateLoading(true);

    try {
      await apiService.updateCategory(editingCategory._id, editFormData);
      setEditingCategory(null);
      setEditFormData({ name: '', description: '' });
      setRefresh(prev => prev + 1);
    } catch (err) {
      setUpdateError(err.response?.data?.error || 'Failed to update category');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteClick = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
      try {
        await apiService.deleteCategory(categoryId);
        setRefresh(prev => prev + 1);
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to delete category';
        alert(`Error: ${errorMsg}`);
      }
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Manage Categories</h2>
      
      {/* Create Form */}
      <CategoryForm onSuccess={handleCategoryCreated} />
      
      {/* Edit Modal */}
      {editingCategory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2c3e50' }}>
              Edit Category
            </h3>

            {updateError && (
              <div style={{
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '4px',
                color: '#c33'
              }}>
                <strong>Error:</strong> {updateError}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Category Name <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Description (Optional)
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={updateLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: updateLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: updateLoading ? '#95a5a6' : '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: updateLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  {updateLoading ? 'Updating...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Category List with Edit & Delete Buttons */}
      <CategoryListWithActions 
        refresh={refresh} 
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
    </div>
  );
}

// Enhanced CategoryList component with edit & delete functionality
function CategoryListWithActions({ refresh, onEditClick, onDeleteClick }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
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

  if (loading) return <div style={{ padding: '1rem' }}>Loading categories...</div>;
  if (error) return <div style={{ color: 'red', padding: '1rem' }}>Error: {error}</div>;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Categories</h3>
      {categories.length === 0 ? (
        <p style={{ color: '#7f8c8d' }}>No categories yet. Create your first category above!</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Created</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', width: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '600' }}>{category.name}</td>
                  <td style={{ padding: '0.75rem', color: '#7f8c8d' }}>
                    {category.description || '-'}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#7f8c8d' }}>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => onEditClick(category)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          transition: 'background-color 0.3s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDeleteClick(category._id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          transition: 'background-color 0.3s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;