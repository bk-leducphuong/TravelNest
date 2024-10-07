require('dotenv').config();
const express = require('express');
const cors = require('cors');

const session = require('express-session');
const bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');

const app = express();

/******************************************* Middleware **********************************************/

app.use(express.json()); // Parses incoming JSON requests

// To Allow cross origin requests originating from selected origins
var corsOptions = {
  origin:  'http://localhost:5173', 
  methods: ['GET, POST, OPTIONS, PUT, DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions));

app.use(bodyParser.json()); // create application/json parser
app.use(bodyParser.urlencoded({ extended: false })); // create application/x-www-form-urlencoded parser

// Configure Session
app.use(session({
  secret: 'your-secret-key', // A secret key to sign the session ID
  resave: false,             // Prevents session being saved back to the session store if nothing changed
  saveUninitialized: false,  // Prevents uninitialized sessions (without changes) from being saved
  cookie: { 
    maxAge: 1000 * 60 * 60 * 2, // 2 hours session expiration
    httpOnly: true,             // Protects against XSS attacks
    secure: false               // Set to true if you're using HTTPS
  }
}));

/******************************************* Import Routes **********************************************/

const hotelRoutes = require('./routes/hotelRoutes');
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes); // Login route

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Hotel Booking API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
