const express = require('express');
const bodyParser = require('body-parser');
// const { handlePayment } = require('../controllers/paymentController');
const { isUserAuthenticated } = require('../middlewares/sessionAuth');
const router = express.Router();

router.use(isUserAuthenticated);
// Route to handle payment
// router.post('/', handlePayment);
// Route to fetch the payment for specific booking
router.get('/:bookingId');

module.exports = router;
