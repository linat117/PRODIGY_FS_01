import React from 'react';
import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  console.log('User:', user);
  console.log('Allowed Roles:', allowedRoles);

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect if user does not have the required role
    return <Navigate to="/unauthorized" />;
  }

  // If the user is authenticated and has an allowed role, render the requested component
  return <Outlet />;
};

export default ProtectedRoute;
