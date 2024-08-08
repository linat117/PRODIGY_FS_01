import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.role}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
