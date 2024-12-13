const express = require('express');
const router = express.Router();
const { validateReview, postReview, getAllReviews } = require('../controllers/reviewController');
const { isUserAuthenticated } = require('../middlewares/sessionAuth');

// root route: /api/review
router.use(isUserAuthenticated);

// Route to validate user who booked the room before writing a review
router.post('/validate-review', validateReview);

router.post('/post-review', postReview);

router.get('/get-all-reviews', getAllReviews);

module.exports = router;