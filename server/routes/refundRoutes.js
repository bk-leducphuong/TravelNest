const express = require('express');
const bodyParser = require('body-parser');
const { handleRefund } = require('../controllers/refundController');
const { isUserAuthenticated } = require('../middlewares/sessionAuth');
const router = express.Router();

//router.use(isUserAuthenticated);
// Route to handle refund
router.post('/', handleRefund);

module.exports = router;