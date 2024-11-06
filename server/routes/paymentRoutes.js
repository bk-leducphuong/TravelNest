const express = require('express');
const bodyParser = require('body-parser');
const { handlePayment, webhookController } = require('../controllers/paymentController');
const router = express.Router();

// Route to handle payment
router.post('/', handlePayment);
// Route for webhook event
router.post('/webhook', bodyParser.raw({type: 'application/json'}), webhookController);

// Route to fetch the payment for specific booking
router.get('/:bookingId');

module.exports = router;