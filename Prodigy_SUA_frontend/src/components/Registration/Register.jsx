import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setPopupMessage('Passwords do not match');
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/register', { username, email, password, role });
      console.log('Register response:', response.data);

      setPopupMessage('Registration successful!');
      setIsSuccess(true);
      setShowPopup(true);

      // Navigate to login page or another page after registration
      setTimeout(() => {
        navigate('/');
      }, 2000); // Navigate after 2 seconds
    } catch (error) {
      console.error('Registration failed', error);
      setError('Registration failed');
      setPopupMessage('Registration failed: ' + (error.response?.data?.message || 'Please try again'));
      setIsSuccess(false);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-300 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
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
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              {/* Add more roles as needed */}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-800 text-white rounded-md hover:bg-[#1148f0] transition duration-300"
            >
              Register
            </button>
          </div>
          <div className="text-center mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <a href="/" className="text-blue-800 hover:underline">Login</a>
          </div>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
          {isSuccess ? (
              <FaCheckCircle className="text-green-500 text-4xl mb-4" />
            ) : (
              <FaTimesCircle className="text-red-500 text-4xl mb-4" />
            )}
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

export default Register;
