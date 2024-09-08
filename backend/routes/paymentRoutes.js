const express = require('express');
const { createPayment, getPayments } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const { validatePayment } = require('../middleware/validateInput');

const router = express.Router();

// Create Payment
router.post('/create', auth, validatePayment, createPayment);

// List Payments
router.get('/list', auth, getPayments);

module.exports = router;
