const express = require('express');
const router = express.Router();
const { protect, verifiedOnly } = require('../middleware/authMiddleware');
const {
  createSlot,
  getSlots,
  getSlotById,
  getMySlots,
  updateSlot,
  deleteSlot
} = require('../controllers/slotController');

// @route   POST /api/slots
router.post('/', protect, verifiedOnly, createSlot);

// @route   GET /api/slots
router.get('/', getSlots);

// @route   GET /api/slots/my-slots
router.get('/my-slots', protect, getMySlots);

// @route   GET /api/slots/:id
router.get('/:id', getSlotById);

// @route   PUT /api/slots/:id
router.put('/:id', protect, updateSlot);

// @route   DELETE /api/slots/:id
router.delete('/:id', protect, deleteSlot);

module.exports = router;
