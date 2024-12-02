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
const http = require('http')

const {webhookController} = require('./controllers/webhookController.js')

const app = express();

// Allow nginx proxy'
app.set('trust proxy', 1);

// stripe webhook endpoint
app.post('/stripe/webhook',bodyParser.raw({type: 'application/json'}), webhookController)

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

app.use(bodyParser.json({limit: '50mb'})); // create application/json parser
app.use(bodyParser.urlencoded({limit: '50mb', extended: false })); // create application/x-www-form-urlencoded parser

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

/******************************************* SOCKET IO **********************************************/
const {init, getIO} = require('./config/socket.js'); // Import socket config
// Create HTTP server
const server = http.createServer(app)
// Initialize Socket.IO using the server
init(server);

/******************************************* Import Routes **********************************************/

// User Routes
const searchRoutes = require('./routes/searchRoutes')
const hotelRoutes = require('./routes/hotelRoutes');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const joinRoutes = require('./routes/joinRoutes');
const paymentRoutes = require('./routes/paymentRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const refundRoutes = require('./routes/refundRoutes.js'); 

app.use('/api/search', searchRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes); // Login route
app.use('/api/join', joinRoutes); // Become a host route
app.use('/api/payment', paymentRoutes);
app.use('/api/refund', refundRoutes);
app.use('/api/user', userRoutes);
app.use('/api/review', reviewRoutes);

// Admin routes
const adminPayoutRoutes = require('./routes/admin/payoutRoutes.js');
const bookingsRoutes = require('./routes/admin/bookingsRoutes.js');
const hotelsManagementRoutes = require('./routes/admin/hotelsManagementRoutes.js');
const roomRoutes = require('./routes/admin/roomRoutes.js');
const adminReviewRoutes = require('./routes/admin/reviewRoutes.js');

app.use('/api/admin/hotels-management', hotelsManagementRoutes);
app.use('/api/admin/payout', adminPayoutRoutes);
app.use('/api/admin/bookings', bookingsRoutes);
app.use('/api/admin/room', roomRoutes);
app.use('/api/admin/review', adminReviewRoutes);

// Common routes
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Hotel Booking API');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
