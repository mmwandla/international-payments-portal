const express = require('express');
const { createPayment, getPayments } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const { validatePayment } = require('../middleware/validateInput');

const router = express.Router();

//create payment route
router.post('/create', auth, validatePayment, createPayment);

//get list of past payments route
router.get('/list', auth, getPayments);

module.exports = router;
