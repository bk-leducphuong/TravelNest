const express = require('express');
const { getAllBookings } = require('../controllers/bookingController');
const {isUserAuthenticated} = require('../middlewares/sessionAuth');
const router = express.Router();

// root route: /api/booking
router.use(isUserAuthenticated);
// Route to fetch all bookings of user
router.get('/get-all-bookings', getAllBookings);
// Route to cancel specific booking
router.delete('/bookings/:id');

module.exports = router;