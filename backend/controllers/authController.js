const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

//helper function to send token in cookie
const sendTokenResponse = (user, statusCode, res) => {
  //sign token
  const token = jwt.sign({ id: user.id, accountNumber: user.accountNumber }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
    httpOnly: true, 
    secure: process.env.NODE_ENV !== 'development', 
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

const registerUser = async (req, res) => {

  const { fullName, idNumber, accountNumber, password } = req.body;

  try {
    //validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userExists = await User.findOne({ where: { accountNumber } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      idNumber,
      accountNumber,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Register User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    //validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ where: { accountNumber } });

    if (!user) {
      return res.status(401).json({ message: 'Wrong account number' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser };
