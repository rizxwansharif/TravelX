const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  recipientDetails: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    }
  },
  parcelDescription: {
    type: String,
    required: true
  },
  estimatedWeight: {
    type: Number,
    required: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  parcelImages: [String],
  contentVerified: {
    type: Boolean,
    default: false
  },
  aiAnalysis: {
    flagged: Boolean,
    reason: String,
    confidence: Number
  },
  agreedPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled', 'flagged'],
    default: 'pending'
  },
  timeline: [{
    status: String,
    timestamp: Date,
    note: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
