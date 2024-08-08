import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect if user does not have the required role
    return <Navigate to="/" />;
  }

  // If the user is authenticated and has an allowed role, render the requested component
  return <Outlet />;
};

export default ProtectedRoute;
