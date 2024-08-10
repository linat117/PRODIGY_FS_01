import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password,
      });
      console.log('Login response:', response.data);

      // Save token to localStorage (or handle as needed)
      localStorage.setItem('token', response.data.token);

      // Redirect based on role
      const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
      setUser({
        id: decodedToken.id,
        role: decodedToken.role,
        // Add other details if necessary
      });
  
      // Redirect based on role
      if (decodedToken.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-300 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-800 text-white rounded-md hover:bg-[#1148f0] transition duration-300"
            >
              Login
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <div className="text-center mt-6">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/register" className="text-blue-800 hover:underline">
        Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
