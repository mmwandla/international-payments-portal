import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import '../styles/Payments.css';

const Payments = () => {
  const [token] = useState(localStorage.getItem('token'));
  const isAuthenticated = !!token;

  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    currency: '',
    provider: '',
    recipientAccountNumber: '',
    swiftCode: '',
  });
  const [errors, setErrors] = useState([]);

  const { amount, currency, provider, recipientAccountNumber, swiftCode } = formData;

  useEffect(() => {
    const fetchPayments = async () => {
      if (isAuthenticated) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
          const res = await axios.get('/api/payments/list', config);
          setPayments(res.data);
        } catch (err) {
          console.error('Error fetching payments:', err);
        }
      }
    };
    fetchPayments();
  }, [isAuthenticated]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const body = JSON.stringify(formData);
      const res = await axios.post('/api/payments/create', body, config);
      setPayments([...payments, res.data]);
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors(['An error occurred']);
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="payments-container">
      <h1 className="payments-title">Payments</h1>
      <div className="signout-button-container">
              <button className="form-button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
      {isAuthenticated ? (
        <>
          <div className="form-container">
            <form onSubmit={onSubmit} className="form-content">
              <input
                type="number"
                placeholder="Amount"
                name="amount"
                value={amount}
                onChange={onChange}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Currency"
                name="currency"
                value={currency}
                onChange={onChange}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Provider"
                name="provider"
                value={provider}
                onChange={onChange}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Recipient Account Number"
                name="recipientAccountNumber"
                value={recipientAccountNumber}
                onChange={onChange}
                className="form-input"
              />
              <input
                type="text"
                placeholder="SWIFT Code"
                name="swiftCode"
                value={swiftCode}
                onChange={onChange}
                className="form-input"
              />
              <button type="submit" className="form-button">Make Payment</button>
            </form>
          </div>
          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((err, index) => (
                <div key={index} className="error-message">{err.msg}</div>
              ))}
            </div>
          )}
        </>
      ) : (
        <Navigate to="/unauthorized" />
      )}
      <h2 className="payments-subtitle">Past Payments</h2>
      <ul className="payments-list">
        {payments.map((payment) => (
          <li key={payment.id} className="payments-list-item">
            {payment.amount} {payment.currency} to {payment.recipientAccountNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;