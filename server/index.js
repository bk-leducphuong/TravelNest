require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// Import Routes
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
