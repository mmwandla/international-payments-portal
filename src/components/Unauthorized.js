import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Unauthorized.css'; 

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>Unauthorized</h1>
      <p>You must be logged in to view this page.</p>
      <Link to="/login" className="login-button">Go to Login</Link>
    </div>
  );
};

export default Unauthorized;