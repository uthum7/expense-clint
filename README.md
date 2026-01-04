# Expense Client Application (Frontend)

A React-based client application for tracking expenses and managing categories through a secure API key authentication system.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Getting Started](#getting-started)
- [Application Structure](#application-structure)
- [Features Guide](#features-guide)
- [API Integration](#api-integration)
- [Constraints](#constraints)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This is the client application (App 2) of the Expense Tracking System. It is a React-based web application that communicates with the backend API exclusively through API keys.

**Key Characteristics:**
- ❌ Does NOT access the database directly
- ❌ Does NOT have user login functionality
- ✅ Uses API key for all authentication
- ✅ All operations performed through REST API calls
- ✅ Complete separation from backend logic

---

## ✨ Features

### Dashboard
- 📊 View total number of expenses
- 💰 See total amount spent
- 📁 Track number of categories
- 📈 Real-time statistics updates

### Category Management
- ➕ Create new expense categories
- 📝 Edit existing categories
- 🗑️ Delete categories (if no expenses exist)
- 📋 View all categories in a table

### Expense Management
- ➕ Add new expenses with category, amount, date, and description
- ✏️ Edit existing expenses
- 🗑️ Delete expenses
- 📋 View all expenses in a sortable table
- 🔍 See expenses grouped by category

### User Experience
- 🔐 Simple API key authentication
- ⚡ Real-time data updates
- 🎨 Clean, responsive interface
- ❗ User-friendly error messages
- 💾 API key stored securely in localStorage

---

## 🛠️ Technology Stack

- **Framework**: React.js (Create React App)
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: Inline CSS (no external CSS framework)
- **Storage**: Browser localStorage (for API key only)

### Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "axios": "^1.3.0"
}
```

---

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5000 (App 1)
- Valid API key from backend

### Steps

1. **Navigate to the project directory**
   ```bash
   cd expense-client-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your backend URL

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Backend API Base URL
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Configuration Notes

- The URL should point to the public API endpoint (`/api/v1`)
- Do NOT include trailing slash
- Change to production URL when deploying

---

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

The application will open automatically at **http://localhost:3000**

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

### Verify Application is Running

You should see:
- Browser opens to http://localhost:3000
- API key input screen appears
- No console errors

---

## 🎬 Getting Started

### Step 1: Get Your API Key

Before using the client application, you need an API key from the backend:

1. Open the backend admin panel: **http://localhost:5000**
2. Register a new account or login
3. Generate an API key with a descriptive name (e.g., "Expense Client App")
4. Click the **📋 Copy** button to copy your key

### Step 2: Enter API Key

1. Open the client application: **http://localhost:3000**
2. You'll see the API key input screen
3. Paste your API key in the input field
4. Click **Save API Key**

### Step 3: Start Using the App

Once authenticated, you can:
- View your dashboard
- Create categories
- Add expenses
- Manage your data

---

## 📁 Application Structure

```
expense-client-app/
├── public/
│   ├── index.html             # HTML template
│   └── favicon.ico
├── src/
│   ├── components/            # Reusable components
│   │   ├── CategoryForm.js    # Form to create categories
│   │   ├── CategoryList.js    # Display categories table
│   │   ├── Dashboard.js       # Statistics dashboard
│   │   ├── ExpenseForm.js     # Form to create expenses
│   │   ├── ExpenseList.js     # Display expenses table
│   │   └── Layout.js          # Main layout with API key input
│   ├── pages/                 # Page components
│   │   ├── CategoriesPage.js  # Categories management page
│   │   ├── ExpensesPage.js    # Expenses management page
│   │   └── HomePage.js        # Dashboard home page
│   ├── services/              # API services
│   │   └── api.js             # Axios configuration and API calls
│   ├── App.js                 # Main app component with routing
│   ├── index.js               # React entry point
│   └── index.css              # Global styles
├── .env                       # Environment variables (not in repo)
├── .env.example              # Environment template
├── package.json
└── README.md
```

---

## 📖 Features Guide

### Dashboard

**Location**: Home page (`/`)

**What it shows:**
- Total number of expenses
- Total amount spent (sum of all expenses)
- Number of categories created

**Refresh**: Data automatically refreshes when you navigate to the page

---

### Managing Categories

**Location**: Categories page (`/categories`)

#### Create a Category
1. Fill in the category name (required)
2. Optionally add a description
3. Click **+ Add Category**

#### Edit a Category
1. Find the category in the table
2. Click the **✏️ Edit** button
3. Update the name or description in the modal
4. Click **Update Category**

#### Delete a Category
1. Find the category in the table
2. Click the **🗑️ Delete** button
3. Confirm the deletion

**Note**: You cannot delete a category that has expenses. Delete the expenses first.

---

### Managing Expenses

**Location**: Expenses page (`/expenses`)

#### Create an Expense
1. Select a category from the dropdown
2. Enter the amount (e.g., 45.99)
3. Add a description (optional)
4. Select a date (defaults to today)
5. Click **Add Expense**

#### Edit an Expense
1. Find the expense in the table
2. Click the **✏️ Edit** button
3. Update any fields in the modal
4. Click **Update Expense**

#### Delete an Expense
1. Find the expense in the table
2. Click the **🗑️ Delete** button
3. Confirm the deletion

---

## 🔌 API Integration

### API Service Layer

All API calls are centralized in `src/services/api.js`:

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// API key is automatically added to all requests
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('apiKey');
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

export const apiService = {
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
};
```

### How It Works

1. **API Key Storage**: Stored in browser's localStorage
2. **Automatic Injection**: Axios interceptor adds `X-API-Key` header to every request
3. **Error Handling**: All components have try-catch blocks for API errors
4. **User Feedback**: Success/error messages displayed to users

---

## 🚫 Constraints

### What This Application Does NOT Do

❌ **No Direct Database Access**
- All data operations go through REST API
- No MongoDB connection in frontend
- No database queries in client code

❌ **No User Login System**
- Only API key authentication
- No username/password in frontend
- No JWT token handling

❌ **No Backend Logic**
- Pure presentation layer
- All business logic in backend
- No data validation beyond UI

### What This Application DOES

✅ **API Key Authentication Only**
- User enters API key once
- Key stored in localStorage
- Key sent with every API request

✅ **Pure API Consumer**
- Makes HTTP requests to backend
- Displays data from API responses
- Sends user input to API

✅ **Client-Side Rendering**
- React components
- State management with hooks
- UI updates based on API data

---

## 🎨 User Interface

### Design Philosophy

- **Simple & Clean**: Focus on functionality
- **Responsive**: Works on desktop and mobile
- **Intuitive**: Clear labels and actions
- **Feedback**: Success/error messages for all actions

### Color Scheme

- Primary: `#3498db` (Blue)
- Success: `#27ae60` (Green)
- Danger: `#e74c3c` (Red)
- Text: `#2c3e50` (Dark Gray)

### Components

All components use inline styles for simplicity and portability.

---

## 🔐 Security Considerations

### API Key Storage

- Stored in browser's localStorage
- Automatically included in all API requests
- Can be removed by clicking "Remove Key"

### Limitations

- localStorage is accessible via JavaScript
- Not suitable for highly sensitive data
- For production, consider more secure methods

### Best Practices

- Don't share your API key
- Revoke keys you're not using
- Generate new keys periodically
- Use HTTPS in production

---

## 🐛 Troubleshooting

### Common Issues

#### "Cannot read property 'map' of undefined"
**Cause**: API returned error or empty data  
**Solution**: Check if backend is running and API key is valid

#### "Network Error"
**Cause**: Backend not running or wrong URL  
**Solution**: 
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in .env file

#### "Invalid or inactive API key"
**Cause**: API key is wrong, revoked, or missing  
**Solution**:
- Generate new API key from admin panel
- Re-enter the key in the application

#### No data showing on dashboard
**Cause**: No categories or expenses created yet  
**Solution**: Create some categories and expenses first

#### Cannot delete category
**Cause**: Category has expenses associated with it  
**Solution**: Delete all expenses in that category first

---

## 📝 Development Notes

### State Management

- Using React Hooks (useState, useEffect)
- No global state management (Redux, Context)
- Local state in each component
- Parent-child communication via props

### Data Flow

```
User Action → Component → API Service → Backend API
                ↓
          Update UI State
                ↓
          Re-render Component
```

### Adding New Features

1. Create API method in `services/api.js`
2. Create component in `components/`
3. Add to appropriate page in `pages/`
4. Handle loading and error states
5. Update UI on success

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Enter valid API key
- [ ] See dashboard with zero values
- [ ] Create a category
- [ ] Create an expense
- [ ] Dashboard shows updated values
- [ ] Edit a category
- [ ] Edit an expense
- [ ] Delete an expense
- [ ] Delete a category
- [ ] Remove API key and re-enter

### Testing API Errors

1. Enter invalid API key → Should show error
2. Stop backend → Should show connection error
3. Delete category with expenses → Should show error message

---

## 📊 Data Persistence

### Important Notes

- All data stored in backend MongoDB database
- Frontend stores only the API key (localStorage)
- Clearing browser data removes API key (need to re-enter)
- Closing browser does NOT delete data

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Update `.env` for production:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api/v1
```

### Hosting Options

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

---

## 🔄 Future Enhancements

Possible improvements:
- Date range filtering for expenses
- Export data to CSV
- Charts and visualizations
- Budget tracking
- Recurring expenses
- Multi-currency support

---

## 📞 Support

### For Backend Issues
- Check backend README
- Verify backend is running
- Test API endpoints with Postman

### For Frontend Issues
- Check browser console for errors
- Verify environment variables
- Clear browser cache
- Re-enter API key

---

## 📄 License

This project is created for educational/assignment purposes.

---

## 🎓 Learning Outcomes

This project demonstrates:
- React component architecture
- RESTful API integration
- Axios for HTTP requests
- React Router for navigation
- State management with hooks
- API key authentication
- Error handling in frontend
- Separation of concerns

---

**Ready to track your expenses!** 🎉

For complete API documentation and backend setup, see the backend README.