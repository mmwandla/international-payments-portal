const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validateInput');

const router = express.Router();

// Registration Route
router.post('/register', validateRegister, registerUser);

// Login Route
router.post('/login', validateLogin, loginUser); 

module.exports = router;
