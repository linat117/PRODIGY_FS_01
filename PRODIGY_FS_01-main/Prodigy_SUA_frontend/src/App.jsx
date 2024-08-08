import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login/Login';
import Register from './components/Registration/Register';
import AdminDashboard from './components/Pages/AdminPage';
import UserDashboard from './components/Pages/UserPage';
import ErrorBoundary from './ErrorBoundry';

const App = () => {
  return (
   
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            {/* Add more routes as needed */}
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
   
  );
};

export default App;
