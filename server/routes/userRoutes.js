const express = require('express');
const {isUserAuthenticated} = require('../middlewares/sessionAuth');
const { getUserInformation, getBookingInformation } = require( '../controllers/userController.js');
const router = express.Router();

// root route: /api/user
router.use(isUserAuthenticated);

router.get('/get-user-information', getUserInformation);
router.post('/me', );

// Route to get booking information of user
router.post('/booking/get-booking-information', getBookingInformation);

module.exports = router;