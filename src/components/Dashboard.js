import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    categoryCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        apiService.getExpenses(),
        apiService.getCategories()
      ]);

      const expenses = expensesRes.data.expenses;
      const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      setStats({
        totalExpenses: expenses.length,
        totalAmount: totalAmount.toFixed(2),
        categoryCount: categoriesRes.data.categories.length
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}>Total Expenses</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#2c3e50' }}>
            {stats.totalExpenses}
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}>Total Amount</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#27ae60' }}>
            ${stats.totalAmount}
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}>Categories</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#3498db' }}>
            {stats.categoryCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;