const fetchProfile = async () => {
    const token = localStorage.getItem('token'); // Or from cookies if used
  
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
  
    const data = await response.json();
    return data;
  };
  
  export default fetchProfile;
  