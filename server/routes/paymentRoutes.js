const express = require('express');
const router = express.Router();

// Route to process the payment for booking
router.post('/payments');
// Route to fetch the payment for specific booking
router.get('/payments/:bookingId');

module.exports = router;