import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function ExpenseList({ refresh }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

  if (loading) return <div>Loading expenses...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>Expenses</h3>
      {expenses.length === 0 ? (
        <p>No expenses yet. Create your first expense above!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '0.75rem' }}>
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {expense.categoryId?.name || 'N/A'}
                </td>
                <td style={{ padding: '0.75rem' }}>{expense.description || '-'}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>
                  ${expense.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExpenseList;