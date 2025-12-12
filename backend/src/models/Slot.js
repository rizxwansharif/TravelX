const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departureCity: {
    type: String,
    required: true
  },
  departureCountry: {
    type: String,
    required: true
  },
  destinationCity: {
    type: String,
    required: true
  },
  destinationCountry: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  availableWeight: {
    type: Number,
    required: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  isNegotiable: {
    type: Boolean,
    default: true
  },
  eTicket: {
    type: String,
    required: true
  },
  is_ticket_verified: {
    type: Boolean,
    default: false
  },
  extractedTicketData: {
    destination: String,
    date: Date,
    flightNumber: String
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Slot', slotSchema);
