// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (user.role !== requiredRole) {
    // Redirect to login if not authorized
    return <Navigate to="/" state={{ from: location }} />;
  }

  return element;
};

export default PrivateRoute;
