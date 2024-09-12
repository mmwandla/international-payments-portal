const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Helper function to send token in HTTP-only cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id, accountNumber: user.accountNumber }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, 
    secure: process.env.NODE_ENV !== 'development', // Sends cookie over HTTPS in development
    sameSite: 'strict', 
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      id: user.id,
      fullName: user.fullName,
      accountNumber: user.accountNumber,
      token,
    });
};

// Register User
const registerUser = async (req, res) => {
  console.log('Request Body:', req.body);
  const { fullName, idNumber, accountNumber, password } = req.body;

  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists
    const userExists = await User.findOne({ where: { accountNumber } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      fullName,
      idNumber,
      accountNumber,
      password,
    });

    // Send token in response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Register User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find user by accountNumber
    const user = await User.findOne({ where: { accountNumber } });

    if (!user) {
      return res.status(401).json({ message: 'Wrong account number' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    // Send token in response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser };
