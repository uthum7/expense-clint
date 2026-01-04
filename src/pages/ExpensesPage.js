import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { apiService } from '../services/api';

function ExpensesPage() {
  const [refresh, setRefresh] = useState(0);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editFormData, setEditFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    date: ''
  });
  const [categories, setCategories] = useState([]);
  const [updateError, setUpdateError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleExpenseCreated = () => {
    setRefresh(prev => prev + 1);
  };

  const handleEditClick = async (expense) => {
    setEditingExpense(expense);
    setEditFormData({
      categoryId: expense.categoryId?._id || '',
      amount: expense.amount.toString(),
      description: expense.description || '',
      date: new Date(expense.date).toISOString().split('T')[0]
    });
    setUpdateError('');

    // Fetch categories for dropdown
    try {
      const response = await apiService.getCategories();
      setCategories(response.data.categories);
    } catch (err) {
      setUpdateError('Failed to load categories');
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setEditFormData({
      categoryId: '',
      amount: '',
      description: '',
      date: ''
    });
    setUpdateError('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateLoading(true);

    try {
      await apiService.updateExpense(editingExpense._id, {
        ...editFormData,
        amount: parseFloat(editFormData.amount)
      });
      setEditingExpense(null);
      setEditFormData({
        categoryId: '',
        amount: '',
        description: '',
        date: ''
      });
      setRefresh(prev => prev + 1);
    } catch (err) {
      setUpdateError(err.response?.data?.error || 'Failed to update expense');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteClick = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense? This cannot be undone.')) {
      try {
        await apiService.deleteExpense(expenseId);
        setRefresh(prev => prev + 1);
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to delete expense';
        alert(`Error: ${errorMsg}`);
      }
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Manage Expenses</h2>
      
      {/* Create Form */}
      <ExpenseForm onSuccess={handleExpenseCreated} />
      
      {/* Edit Modal */}
      {editingExpense && (
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
              Edit Expense
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
                  Category <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <select
                  value={editFormData.categoryId}
                  onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Amount <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Date <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
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
                  {updateLoading ? 'Updating...' : 'Update Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Expense List with Edit & Delete Buttons */}
      <ExpenseListWithActions 
        refresh={refresh} 
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
    </div>
  );
}

// Enhanced ExpenseList component with edit & delete functionality
function ExpenseListWithActions({ refresh, onEditClick, onDeleteClick }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetchExpenses();
  }, [refresh]);

  const fetchExpenses = async () => {
    try {
      const response = await apiService.getExpenses();
      setExpenses(response.data.expenses);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch expenses');
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '1rem' }}>Loading expenses...</div>;
  if (error) return <div style={{ color: 'red', padding: '1rem' }}>Error: {error}</div>;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Expenses</h3>
      {expenses.length === 0 ? (
        <p style={{ color: '#7f8c8d' }}>No expenses yet. Create your first expense above!</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', width: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '0.75rem' }}>
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: '600' }}>
                    {expense.categoryId?.name || 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#7f8c8d' }}>
                    {expense.description || '-'}
                  </td>
                  <td style={{ 
                    padding: '0.75rem', 
                    textAlign: 'right', 
                    fontWeight: 'bold',
                    color: '#27ae60'
                  }}>
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => onEditClick(expense)}
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
                        onClick={() => onDeleteClick(expense._id)}
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

export default ExpensesPage;