import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <h1>International Payment Portal</h1>
      <button className="proceed-button" onClick={handleProceed}>
        Proceed to Customer Portal
      </button>
    </div>
  );
};

export default LandingPage;
