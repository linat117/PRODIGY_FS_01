import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user?.role}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserDashboard;
