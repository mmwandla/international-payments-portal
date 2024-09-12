const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { sequelize, connectDB } = require('./config/db');
const ExpressBrute = require('express-brute');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();
sequelize.sync(); // Sync models to create tables in the database

const app = express();

app.set('trust proxy', 1);

// Use cookie-parser 
app.use(cookieParser()); 

// Implement secure HTTP headers
app.use(helmet());

// Enable CORS with appropriate configuration
const corsOptions = {
  origin: 'https://localhost:3000', // Frontend URL
  credentials: true,
};
app.use(cors(corsOptions));

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  },
}));

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Brute-force protection 
const store = new ExpressBrute.MemoryStore();
const bruteForce = new ExpressBrute(store);

app.use(express.json({ limit: '5000kb' }));

app.use('/api/auth', bruteForce.prevent, authRoutes);

app.get('/api/csrf-token', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken()); // Set CSRF token in a cookie
  res.json({ csrfToken: req.csrfToken() });
});

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
  }
}));


// Payment route
app.use('/api/payments', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 443;

// Configure HTTPS (SSL)
if (process.env.NODE_ENV === 'development') {
  const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'certs', 'localhost+2-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'localhost+2.pem'))
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`Secure server running on port ${PORT}`);
  }).setTimeout(60000);
} else {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
