const express = require('express');
const router = express.Router();
const { protect, verifiedOnly } = require('../middleware/authMiddleware');
const {
  updateProfile,
  uploadCNIC,
  liveVerification,
  getUserById
} = require('../controllers/userController');

// @route   PUT /api/users/profile
router.put('/profile', protect, updateProfile);

// @route   POST /api/users/verify/cnic
router.post('/verify/cnic', protect, uploadCNIC);

// @route   POST /api/users/verify/live
router.post('/verify/live', protect, liveVerification);

// @route   GET /api/users/:id
router.get('/:id', getUserById);

module.exports = router;
