const express = require('express');
const router = express.Router();
const { validateUser } = require('../controllers/reviewController');
const { isUserAuthenticated } = require('../middlewares/sessionAuth');

// root route: /api/review
router.use(isUserAuthenticated);

// Route to validate user who booked the room before writing a review
router.post('/validate-user', validateUser);

module.exports = router;