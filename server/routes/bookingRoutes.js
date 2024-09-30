const express = require('express');
const router = express.Router();

// Route to make a booking
router.post('/bookings');
// Route to fetch details of specific booking
router.get('/bookings/:id');
// Route to fetch all bookings of user
router.get('/bookings');
// Route to cancel specific booking
router.delete('/bookings/:id');

module.exports = router;