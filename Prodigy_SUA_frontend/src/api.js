import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Ensure this matches your backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
