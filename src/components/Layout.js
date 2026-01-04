import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

function Layout({ children }) {
  const [apiKey, setApiKeyState] = useState(apiService.getApiKey() || '');
  const [tempKey, setTempKey] = useState('');

  useEffect(() => {
    setApiKeyState(apiService.getApiKey() || '');
  }, []);

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      apiService.setApiKey(tempKey.trim());
      setApiKeyState(tempKey.trim());
      setTempKey('');
      window.location.reload(); // Refresh to apply new key
    }
  };

  const handleRemoveKey = () => {
    apiService.removeApiKey();
    setApiKeyState('');
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0 }}>Expense Client Application</h1>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1rem'
      }}>
        {!apiKey ? (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2>Enter API Key</h2>
            <p>Please enter your API key to access the expense tracking system.</p>
            <input
              type="text"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Enter API key"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}
            />
            <button
              onClick={handleSaveKey}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Save API Key
            </button>
          </div>
        ) : (
          <>
            <div style={{
              backgroundColor: '#ecf0f1',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>API Key: </strong>
                <code>{apiKey.substring(0, 20)}...</code>
              </div>
              <button
                onClick={handleRemoveKey}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remove Key
              </button>
            </div>
            {children}
          </>
        )}
      </div>
    </div>
  );
}

export default Layout;