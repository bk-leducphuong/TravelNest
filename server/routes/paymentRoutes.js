const express = require('express');
const bodyParser = require('body-parser');
const { handlePayment } = require('../controllers/paymentController');
const router = express.Router();

// Route to handle payment
router.post('/', handlePayment);
// Route to fetch the payment for specific booking
router.get('/:bookingId');

module.exports = router;