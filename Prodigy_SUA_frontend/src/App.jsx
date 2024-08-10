import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login/Login';
import Register from './components/Registration/Register';
import AdminDashboard from './components/Pages/AdminPage';
import UserDashboard from './components/Pages/UserPage';
import ErrorBoundary from './ErrorBoundry';
import ProtectedRoute from './components/Protected/ProtectedRoute';

const App = () => {
  return (

      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/user-dashboard" element={<UserDashboard />} />
            </Route>

            {/* Add more routes as needed */}
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
 
  );
};

export default App;
