const router = require('express').Router();
const connection = require('../../config/db');
const { isAdminAuthenticated } = require('../../middlewares/sessionAuth')
const { getAllBookings } = require('../../controllers/admin/bookingsController');

// root route: /api/admin/bookings
router.use(isAdminAuthenticated);

router.get('/all', getAllBookings);

module.exports = router;