require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const RedisStore = require("connect-redis").default
const redisClient = require('./config/redis') // connect to redis cloud
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const bodyParser = require('body-parser');
require('./config/passportConfig.js');
const app = express();

const {webhookController} = require('./controllers/paymentController')

// Allow nginx proxy
app.set('trust proxy', 1);

// webhook endpoint
app.post('/api/payment/webhook',bodyParser.raw({type: 'application/json'}), webhookController)

/******************************************* Middleware **********************************************/
// Serve static files from the 'public' directory
app.use(express.static('public'));

// To Allow cross origin requests originating from selected origins
var corsOptions = {
  origin:  'http://localhost:5173', 
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions));

app.use(bodyParser.json()); // create application/json parser
app.use(bodyParser.urlencoded({ extended: false })); // create application/x-www-form-urlencoded parser

// Configure Session
app.use(session({
  // genid: (req) => {
  //   return uuidv4() // Use UUIDs for session IDs
  // },
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET_KEY, // A secret key to sign the session ID
  resave: false,             // Prevents session being saved back to the session store if nothing changed
  saveUninitialized: false,  // Prevents uninitialized sessions (without changes) from being saved
  cookie: { 
    maxAge: 1000 * 60 * 60 * 365 * 24, // one year session expiration
    httpOnly: true,             // Protects against XSS attacks
    secure: process.env.NODE_ENV === 'production'               // Set to true if you're using HTTPS
  }
}));

// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

/******************************************* Import Routes **********************************************/

const searchRoutes = require('./routes/searchRoutes')
const hotelRoutes = require('./routes/hotelRoutes');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const joinRoutes = require('./routes/joinRoutes');
const paymentRoutes = require('./routes/paymentRoutes.js');
const roomRoutes = require('./routes/roomRoutes.js');


// Use Routes
app.use('/api/search', searchRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes); // Login route
app.use('/api/join', joinRoutes); // Become a host route
app.use('/api/payment', paymentRoutes);
app.use('/api/room', roomRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Hotel Booking API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
