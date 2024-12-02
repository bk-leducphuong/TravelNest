const express = require('express');
const router = express.Router();
const { validateUser, postReview } = require('../controllers/reviewController');
const { isUserAuthenticated } = require('../middlewares/sessionAuth');

// root route: /api/review
router.use(isUserAuthenticated);

// Route to validate user who booked the room before writing a review
router.post('/validate-user', validateUser);

router.post('/post-review', postReview);

module.exports = router;