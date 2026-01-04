import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ExpensesPage from './pages/ExpensesPage';

function App() {
  return (
    <Router>
      <Layout>
        <nav style={{ 
          marginBottom: '2rem',
          borderBottom: '2px solid #ecf0f1',
          paddingBottom: '1rem'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={navButtonStyle}>
              🏠 Dashboard
            </button>
          </Link>
          <Link to="/categories" style={{ textDecoration: 'none' }}>
            <button style={navButtonStyle}>
              📁 Categories
            </button>
          </Link>
          <Link to="/expenses" style={{ textDecoration: 'none' }}>
            <button style={navButtonStyle}>
              💰 Expenses
            </button>
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

const navButtonStyle = {
  padding: '0.75rem 1.5rem',
  marginRight: '0.5rem',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'background-color 0.3s'
};

export default App;