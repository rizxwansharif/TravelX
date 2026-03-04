const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create review for user
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { orderId, revieweeId, rating, comment, categories } = req.body;

    // Validation
    if (!orderId || !revieweeId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide orderId, revieweeId, and rating'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check order exists and user is part of it
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.sender.toString() !== req.user.id && 
        order.traveler.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this order'
      });
    }

    // Can't review yourself
    if (req.user.id === revieweeId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review yourself'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      order: orderId,
      reviewer: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this order'
      });
    }

    // Create review
    const review = await Review.create({
      order: orderId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating,
      comment,
      categories
    });

    // Update user rating
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(revieweeId, {
      rating: Math.round(avgRating * 10) / 10
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'fullName profileImage')
      .populate('reviewee', 'fullName profileImage');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get reviews for user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'fullName profileImage')
      .populate('order')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalReviews = await Review.countDocuments({ reviewee: userId });

    res.status(200).json({
      success: true,
      total: totalReviews,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get review statistics for user
// @route   GET /api/reviews/stats/:userId
// @access  Public
const getReviewStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId });

    if (reviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          categoryAverages: {
            communication: 0,
            reliability: 0,
            safety: 0
          },
          ratingDistribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          }
        }
      });
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    // Calculate category averages
    const categoryAverages = {
      communication: 0,
      reliability: 0,
      safety: 0
    };

    reviews.forEach(review => {
      if (review.categories) {
        if (review.categories.communication) categoryAverages.communication += review.categories.communication;
        if (review.categories.reliability) categoryAverages.reliability += review.categories.reliability;
        if (review.categories.safety) categoryAverages.safety += review.categories.safety;
      }
    });

    Object.keys(categoryAverages).forEach(key => {
      categoryAverages[key] = Math.round((categoryAverages[key] / totalReviews) * 10) / 10;
    });

    // Rating distribution
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        categoryAverages,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getReviewStats
};
