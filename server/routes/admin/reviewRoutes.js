const express = require('express');
const router = express.Router();
const { getReviews, postReview } = require('../../controllers/admin/reviewController');
const { isAdminAuthenticated } = require('../../middlewares/sessionAuth');

// root route: /api/admin/review
router.use(isAdminAuthenticated);

// Route to get all reviews
router.get('/get-reviews', getReviews);

// Route to post a review
router.post('/post-review', postReview);

module.exports = router;