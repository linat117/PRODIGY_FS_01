import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', 
        { email, password }, 
        { withCredentials: true }
      );
      const token = response.data.token;
      const role = response.data.role;

      if (!role || !token) {
        setError('Login failed: Role or token missing');
        setPopupMessage('Login failed: Role or token missing');
        setShowPopup(true);
        return;
      }

      localStorage.setItem('token', token);
      login(role, token);

      setPopupMessage('Login successful!');
      setShowPopup(true);

      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'user') {
        navigate('/user-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      setError(errorMessage);
      setPopupMessage('Login failed: ' + errorMessage);
      setShowPopup(true);
    }
  };

  // Define the closePopup function
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-300 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              name="email"
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
              name="password"
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
          <div className="text-center mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/register" className="text-blue-800 hover:underline">Register</a>
          </div>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">{popupMessage}</h3>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-[#1148f0] transition duration-300"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
