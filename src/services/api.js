import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Store API key in localStorage (in production, use more secure methods)
const getApiKey = () => localStorage.getItem('apiKey');
const setApiKey = (key) => localStorage.setItem('apiKey', key);
const removeApiKey = () => localStorage.removeItem('apiKey');

const api = axios.create({
  baseURL: API_URL,
});

// Add API key to all requests
api.interceptors.request.use((config) => {
  const apiKey = getApiKey();
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

// API methods
export const apiService = {
  // Setup
  setApiKey,
  getApiKey,
  removeApiKey,
  
  // Categories
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  
  // Expenses
  getExpenses: () => api.get('/expenses'),
  createExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  getExpensesByRange: (start, end) => api.get(`/expenses/range?start=${start}&end=${end}`),
};

export default api;