const router = require('express').Router();
const connection = require('../../config/db');
const { isAdminAuthenticated } = require('../../middlewares/sessionAuth')
const { getAllBookings, getBookerInformation } = require('../../controllers/admin/bookingsController');

// root route: /api/admin/bookings
router.use(isAdminAuthenticated);

router.post('/all', getAllBookings);

// Route to get name of the person who booked the room
router.post('/get-booker-information', getBookerInformation);

module.exports = router;