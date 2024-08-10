import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-300 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">Admin Dashboard</h1>
        <p className="text-xl mb-6 text-gray-600">Welcome, {user?.role}!</p>
        <button
          onClick={handleLogout}
          className="w-full p-3 bg-blue-800 text-white rounded-md hover:bg-[#1148f0] transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
