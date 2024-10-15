require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const RedisStore = require("connect-redis").default
const redisClient = require('./config/redis') // connect to redis cloud
const session = require('express-session');
const bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');

const app = express();

// Allow nginx proxy
app.set('trust proxy', true);

/******************************************* Middleware **********************************************/

app.use(express.json()); // Parses incoming JSON requests

// Serve static files from the 'public' directory
app.use(express.static('public'));

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
  genid: (req) => {
    return uuidv4() // Use UUIDs for session IDs
  },
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET_KEY, // A secret key to sign the session ID
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
const homeRoutes = require('./routes/homeRoutes');
const hostRoutes = require('./routes/hostRoutes');

// Use Routes
app.use('/api/home', homeRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes); // Login route
app.use('/api/host', hostRoutes); // Become a host route

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Hotel Booking API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
