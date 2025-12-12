const express = require('express');
const router = express.Router();
const { protect, verifiedOnly } = require('../middleware/authMiddleware');

// Placeholder routes
router.post('/', protect, verifiedOnly, (req, res) => {
  res.json({ message: 'Create order route' });
});

router.get('/', protect, (req, res) => {
  res.json({ message: 'Get orders route' });
});

module.exports = router;
