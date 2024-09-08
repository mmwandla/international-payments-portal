import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Form.css';

const Login = () => {
  const [formData, setFormData] = useState({ accountNumber: '', password: '' });
  const [errors, setErrors] = useState([]); 
  const [csrfToken, setCsrfToken] = useState(''); // Add state for CSRF token
  const navigate = useNavigate();
  const { accountNumber, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/api/csrf-token', { withCredentials: true }); // Ensure cookies are sent
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      setErrors([{ msg: 'Error fetching CSRF token.' }]);
    }
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Fetch CSRF token before making the request
    await fetchCsrfToken();
  
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,  // Include the CSRF token in headers
        },
        withCredentials: true,  // Ensure cookies are sent with the POST request
      };
      const body = JSON.stringify(formData);
  
      const res = await axios.post('/api/auth/login', body, config);
      localStorage.setItem('token', res.data.token);
      navigate('/payments');
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors); 
      } else {
        setErrors([{ msg: 'An error occurred' }]); 
      }
    }
  };
  
  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Account Number"
          name="accountNumber"
          value={accountNumber}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
        />
        <button type="submit" className="submit-button">Login</button>
      </form>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((err, index) => (
            <div key={index} className="error-message">{err.msg}</div>
          ))}
        </div>
      )}
      <Link to="/register" className="register-link">Don't have an account? Go Register.</Link>
    </div>
  );
};

export default Login;
