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

//load environment variables from .env
dotenv.config();

//connect to the db
connectDB();

//sync models to create tables in the db
sequelize.sync(); 

const app = express();

app.set('trust proxy', 1);

//use cookie-parser 
app.use(cookieParser()); 

//implement secure HTTP headers
app.use(helmet());

//configure cors with allowed origin
const corsOptions = {
  //frontend react app url
  origin: 'https://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

//prevent cross site scripting attacks (xss)
app.use(xss());

//rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

//session management
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

//csrf protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

//brute-force protection 
const store = new ExpressBrute.MemoryStore();
const bruteForce = new ExpressBrute(store);

//json limit
app.use(express.json({ limit: '5000kb' }));

//auth routes
app.use('/api/auth', bruteForce.prevent, authRoutes);

//csrf token route
app.get('/api/csrf-token', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.json({ csrfToken: req.csrfToken() });
});

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
  }
}));

//payment routes
app.use('/api/payments', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 443;

//configure HTTPS (SSL) by creating a secure server using cert and key
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
