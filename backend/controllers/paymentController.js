const Payment = require('../models/Payment');
const { validationResult } = require('express-validator');

// Create a new payment
const createPayment = async (req, res) => {
  const {
    accountNumber,
    amount,
    currency,
    provider,
    recipientAccountNumber,
    swiftCode,
  } = req.body;

  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Ensure the accountNumber in the body matches the authenticated user's accountNumber
    if (accountNumber !== req.user.accountNumber) {
      return res.status(403).json({ message: 'Account number mismatch' });
    }

    // Create payment in MySQL using Sequelize
    const payment = await Payment.create({
      accountNumber,
      amount,
      currency,
      provider,
      recipientAccountNumber,
      swiftCode,
      status: 'Pending', // Default status
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all payments for the authenticated user
const getPayments = async (req, res) => {
  try {
    // Fetch payments using Sequelize
    const payments = await Payment.findAll({
      where: {
        accountNumber: req.user.accountNumber,
      },
    });

    res.json(payments);
  } catch (error) {
    console.error('Get Payments Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createPayment, getPayments };
