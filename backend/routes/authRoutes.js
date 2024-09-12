const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validateInput');

const router = express.Router();

//register Route
router.post('/register', validateRegister, registerUser);

//login Route
router.post('/login', validateLogin, loginUser); 

module.exports = router;
