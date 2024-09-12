import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState([]); 
  const navigate = useNavigate();
  const { fullName, idNumber, accountNumber, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfRes = await axios.get('/api/csrf-token');
      const csrfToken = csrfRes.data.csrfToken;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
      };
      const body = JSON.stringify(formData);
  
      const res = await axios.post('/api/auth/register', body, config);
      localStorage.setItem('token', res.data.token);
      navigate('/payments');
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors); 
      } else {
        setErrors(['An error occurred']);
      }
    }
  };  

  return (
    <div className="form-container">
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          name="fullName"
          value={fullName}
          onChange={onChange}
        />
        <input
          type="text"
          placeholder="ID Number"
          name="idNumber"
          value={idNumber}
          onChange={onChange}
        />
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
        <button type="submit" className="submit-button">Register</button>
      </form>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((err, index) => (
            <div key={index} className="error-message">{err.msg}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Register;
