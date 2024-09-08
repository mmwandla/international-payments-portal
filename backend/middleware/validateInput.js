const { check, validationResult } = require('express-validator');

// Regular expression patterns for whitelisting
const fullNamePattern = /^[a-zA-Z\s]+$/; // Only letters and spaces allowed
const idNumberPattern = /^\d{13}$/; // Only 13 digits allowed
const accountNumberPattern = /^\d{6,}$/; // Only digits, minimum 6 digits
const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]+$/; // Letters, digits, and certain special characters
const currencyPattern = /^[A-Z]{3}$/; // 3 uppercase letters, e.g., USD, EUR
const providerPattern = /^[a-zA-Z\s]+$/; // Only letters and spaces allowed
const swiftCodePattern = /^[A-Za-z0-9]{8,11}$/; // 8 to 11 alphanumeric characters

const validateRegister = [
  check('fullName')
    .not()
    .isEmpty()
    .withMessage('Full name is required')
    .matches(fullNamePattern)
    .withMessage('Full name can only contain letters and spaces'),
  
  check('idNumber')
    .not()
    .isEmpty()
    .withMessage('Valid ID number is required')
    .matches(idNumberPattern)
    .withMessage('ID number must contain exactly 13 digits'),
  
  check('accountNumber')
    .not()
    .isEmpty()
    .withMessage('Valid account number is required')
    .matches(accountNumberPattern)
    .withMessage('Account number must contain only digits and be at least 6 digits long'),
  
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 or more characters')
    .matches(passwordPattern)
    .withMessage('Password can only contain letters, digits, and !@#$%^&*'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  check('accountNumber')
    .not()
    .isEmpty()
    .withMessage('Valid account number is required')
    .matches(accountNumberPattern)
    .withMessage('Account number must contain only digits and be at least 6 digits long'),
  
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 or more characters')
    .matches(passwordPattern)
    .withMessage('Password can only contain letters, digits, and !@#$%^&*'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validatePayment = [
  check('amount')
    .not()
    .isEmpty()
    .withMessage('Amount is required')
    .isNumeric()
    .withMessage('Amount must be a valid number'),

  check('currency')
    .not()
    .isEmpty()
    .withMessage('Currency is required')
    .matches(currencyPattern)
    .withMessage('Currency must be a 3-letter uppercase code, e.g., USD'),

  check('provider')
    .not()
    .isEmpty()
    .withMessage('Provider is required')
    .matches(providerPattern)
    .withMessage('Provider can only contain letters and spaces'),

  check('recipientAccountNumber')
    .not()
    .isEmpty()
    .withMessage('Recipient account number is required')
    .matches(accountNumberPattern)
    .withMessage('Recipient account number must contain only digits and be at least 6 digits long'),

  check('swiftCode')
    .not()
    .isEmpty()
    .withMessage('Valid SWIFT code is required')
    .matches(swiftCodePattern)
    .withMessage('SWIFT code must be alphanumeric and 8 to 11 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateRegister, validateLogin, validatePayment };
