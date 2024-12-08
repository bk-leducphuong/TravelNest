const express = require('express');
const bodyParser = require('body-parser');
const { handleCancel } = require('../controllers/cancelController');
const { isUserAuthenticated } = require('../middlewares/sessionAuth');
const router = express.Router();

// root route: /api/cancel-bookings
//router.use(isUserAuthenticated);
// Route to handle refund
router.post('/', handleCancel);

module.exports = router;