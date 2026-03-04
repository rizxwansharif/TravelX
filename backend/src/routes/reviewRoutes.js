const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createReview,
  getUserReviews,
  getReviewStats
} = require('../controllers/reviewController');

// @route   POST /api/reviews
router.post('/', protect, createReview);

// @route   GET /api/reviews/user/:userId
router.get('/user/:userId', getUserReviews);

// @route   GET /api/reviews/stats/:userId
router.get('/stats/:userId', getReviewStats);

module.exports = router;
