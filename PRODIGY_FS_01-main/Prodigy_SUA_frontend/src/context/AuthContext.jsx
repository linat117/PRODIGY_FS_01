import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for token and role on component mount
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ role });
    }
  }, []);

  const login = (role, token) => {
    console.log('Logging in with role:', role);
    setUser({ role });
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    // Redirect based on role
    if (role === 'admin') {
      console.log('Navigating to admin dashboard');
      navigate('/admin-dashboard');
    } else if (role === 'user') {
      console.log('Navigating to user dashboard');
      navigate('/user-dashboard');
    } else {
      console.log('Navigating to home');
      navigate('/');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
