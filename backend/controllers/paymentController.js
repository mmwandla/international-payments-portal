const Payment = require('../models/Payment');
const { validationResult } = require('express-validator');

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
    //validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payment = await Payment.create({
      accountNumber: req.user.accountNumber,
      amount,
      currency,
      provider,
      recipientAccountNumber,
      swiftCode,
      status: 'Pending', 
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
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
