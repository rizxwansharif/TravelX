const express = require('express');
const router = express.Router();
const { protect, verifiedOnly } = require('../middleware/authMiddleware');

// Placeholder routes
router.post('/', protect, verifiedOnly, (req, res) => {
  res.json({ message: 'Create slot route' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get slots route' });
});

module.exports = router;
