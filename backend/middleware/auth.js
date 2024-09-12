const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const auth = async (req, res, next) => {
  let token;

  //checking for token in cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  //checking for token in authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find user by id and account number
    req.user = await User.findOne({
      where: {
        id: decoded.id,
        accountNumber: decoded.accountNumber
      },
      attributes: { exclude: ['password'] }
    });

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = auth;
