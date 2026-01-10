const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  postReview,
  replyToReview,
} = require('../../controllers/admin/reviewController');
const { isAdminAuthenticated } = require('../../middlewares/sessionAuth');

// root route: /api/admin/review
router.use(isAdminAuthenticated);

// Route to get all reviews
router.post('/get-all-reviews', getAllReviews);

// Route to post a review
router.post('/post-review', postReview);

// Route to reply to a review
router.post('/reply-to-review', replyToReview);

module.exports = router;
