const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getOrderMessages,
  getUnreadCount
} = require('../controllers/messageController');

// @route   GET /api/messages/:orderId
router.get('/:orderId', protect, getOrderMessages);

// @route   GET /api/messages/unread/count
router.get('/unread/count', protect, getUnreadCount);

module.exports = router;
